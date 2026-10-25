-- =============================================================================
-- Day1 — SQL propio (migración "extras")
-- Contiene lo que schema.prisma no puede expresar: enlace con Supabase Auth,
-- trigger de alta, datos iniciales, restricciones CHECK, índices parciales y RLS.
-- Se pega dentro de prisma/migrations/<fecha>_extras/migration.sql
-- (creado con: npx prisma migrate dev --create-only --name extras)
-- =============================================================================

-- 1) Categorías iniciales ------------------------------------------------------
INSERT INTO "categories" ("key", "name", "color", "sort_order") VALUES
  ('study',    'Estudio',  '#B7D9BD', 1),
  ('gym',      'Gimnasio', '#F1C8A7', 2),
  ('habit',    'Hábito',   '#CDBDF1', 3),
  ('personal', 'Personal', '#BBD9F0', 4)
ON CONFLICT ("key") DO NOTHING;

-- 2) Ejercicios por defecto (user_id NULL = del sistema) -----------------------
INSERT INTO "exercises" ("name", "muscle_group") VALUES
  ('Press de banca',            'Pecho'),
  ('Press inclinado',           'Pecho'),
  ('Aperturas con mancuernas',  'Pecho'),
  ('Flexiones',                 'Pecho'),
  ('Fondos en paralelas',       'Pecho'),
  ('Dominadas',                 'Espalda'),
  ('Remo con barra',            'Espalda'),
  ('Remo con mancuerna',        'Espalda'),
  ('Jalón al pecho',            'Espalda'),
  ('Peso muerto',               'Espalda'),
  ('Press militar',             'Hombros'),
  ('Elevaciones laterales',     'Hombros'),
  ('Pájaros',                   'Hombros'),
  ('Curl de bíceps',            'Bíceps'),
  ('Curl martillo',             'Bíceps'),
  ('Extensión de tríceps',      'Tríceps'),
  ('Press francés',             'Tríceps'),
  ('Sentadilla',                'Piernas'),
  ('Prensa de piernas',         'Piernas'),
  ('Peso muerto rumano',        'Piernas'),
  ('Zancadas',                  'Piernas'),
  ('Extensión de cuádriceps',   'Piernas'),
  ('Curl femoral',              'Piernas'),
  ('Hip thrust',                'Glúteos'),
  ('Elevación de talones',      'Pantorrillas'),
  ('Plancha',                   'Abdomen'),
  ('Crunch abdominal',          'Abdomen'),
  ('Elevación de piernas',      'Abdomen'),
  ('Cinta de correr',           'Cardio'),
  ('Bicicleta estática',        'Cardio'),
  ('Remo en máquina',           'Cardio'),
  ('Saltar la cuerda',          'Cardio');

-- 3) Índices únicos parciales de ejercicios ---------------------------------------
-- (sin repetir nombres: ni en la lista del sistema, ni dentro de la lista de un usuario)
CREATE UNIQUE INDEX "exercises_system_name_key"
  ON "exercises" (lower("name")) WHERE "user_id" IS NULL AND "deleted_at" IS NULL;
CREATE UNIQUE INDEX "exercises_user_name_key"
  ON "exercises" ("user_id", lower("name")) WHERE "user_id" IS NOT NULL AND "deleted_at" IS NULL;

-- 4) Restricciones de integridad (CHECK) ---------------------------------------
ALTER TABLE "users"
  ADD CONSTRAINT "users_week_starts_on_range"   CHECK ("week_starts_on" BETWEEN 0 AND 6),
  ADD CONSTRAINT "users_reminder_range"         CHECK ("default_reminder_minutes" IS NULL OR "default_reminder_minutes" BETWEEN 0 AND 10080);

ALTER TABLE "categories"
  ADD CONSTRAINT "categories_color_hex"         CHECK ("color" ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE "activities"
  ADD CONSTRAINT "activities_title_not_blank"       CHECK (char_length(btrim("title")) > 0),
  ADD CONSTRAINT "activities_duration_range"        CHECK ("duration_minutes" IS NULL OR "duration_minutes" BETWEEN 1 AND 1440),
  ADD CONSTRAINT "activities_duration_needs_time"   CHECK ("start_time" IS NOT NULL OR "duration_minutes" IS NULL),
  ADD CONSTRAINT "activities_reminder_range"        CHECK ("reminder_minutes" IS NULL OR "reminder_minutes" BETWEEN 0 AND 10080),
  ADD CONSTRAINT "activities_recurrence_pair"       CHECK (("recurrence_id" IS NULL) = ("occurrence_date" IS NULL));

ALTER TABLE "activity_reschedules"
  ADD CONSTRAINT "activity_reschedules_changed"     CHECK (ROW("from_date", "from_time") IS DISTINCT FROM ROW("to_date", "to_time"));

ALTER TABLE "activity_recurrences"
  ADD CONSTRAINT "recurrences_title_not_blank"      CHECK (char_length(btrim("title")) > 0),
  ADD CONSTRAINT "recurrences_interval_range"       CHECK ("interval_count" BETWEEN 1 AND 365),
  ADD CONSTRAINT "recurrences_date_order"           CHECK ("end_date" IS NULL OR "end_date" >= "start_date"),
  ADD CONSTRAINT "recurrences_duration_range"       CHECK ("duration_minutes" IS NULL OR "duration_minutes" BETWEEN 1 AND 1440),
  ADD CONSTRAINT "recurrences_duration_needs_time"  CHECK ("start_time" IS NOT NULL OR "duration_minutes" IS NULL),
  ADD CONSTRAINT "recurrences_reminder_range"       CHECK ("reminder_minutes" IS NULL OR "reminder_minutes" BETWEEN 0 AND 10080),
  ADD CONSTRAINT "recurrences_days_valid"           CHECK ("days_of_week" <@ ARRAY[0,1,2,3,4,5,6]::smallint[]),
  -- DIARIA: sin días de la semana. SEMANAL: al menos un día.
  ADD CONSTRAINT "recurrences_days_by_frequency"    CHECK (
    ("frequency" = 'DAILY'  AND COALESCE(cardinality("days_of_week"), 0) = 0) OR
    ("frequency" = 'WEEKLY' AND COALESCE(cardinality("days_of_week"), 0) >= 1)
  );

ALTER TABLE "exercises"
  ADD CONSTRAINT "exercises_name_not_blank"         CHECK (char_length(btrim("name")) > 0);

ALTER TABLE "workout_sessions"
  ADD CONSTRAINT "workout_sessions_time_order"      CHECK ("ended_at" IS NULL OR "started_at" IS NULL OR "ended_at" >= "started_at");

ALTER TABLE "workout_sets"
  ADD CONSTRAINT "workout_sets_reps_positive"       CHECK ("reps" IS NULL OR "reps" > 0),
  ADD CONSTRAINT "workout_sets_weight_nonneg"       CHECK ("weight_value" IS NULL OR "weight_value" >= 0),
  ADD CONSTRAINT "workout_sets_duration_positive"   CHECK ("duration_seconds" IS NULL OR "duration_seconds" > 0),
  -- el peso y su unidad van siempre juntos
  ADD CONSTRAINT "workout_sets_weight_with_unit"    CHECK (("weight_value" IS NULL) = ("weight_unit" IS NULL));

-- 4b) Borrado de cuenta sin bloqueos ----------------------------------------------
-- Un ejercicio en uso no se puede borrar, pero esa comprobación debe hacerse al FINAL de la
-- transacción: al borrar una cuenta, Postgres borra en cascada ejercicios y entrenamientos
-- del usuario en un orden que no controlamos, y sin esto el borrado fallaría.
ALTER TABLE "workout_session_exercises"
  ALTER CONSTRAINT "workout_session_exercises_exercise_id_fkey" DEFERRABLE INITIALLY DEFERRED;

-- 5) Seguridad a nivel de fila (RLS) -------------------------------------------
-- Sin políticas = nadie puede leer ni escribir por la API pública de Supabase (anon key).
-- NestJS se conecta con el rol "postgres", que se salta RLS: la autorización por
-- propietario la aplica el backend.
ALTER TABLE "users"                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activities"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_reschedules"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_recurrences"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercises"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workout_sessions"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workout_session_exercises" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workout_sets"              ENABLE ROW LEVEL SECURITY;

-- 6) Alta automática de usuarios desde Supabase Auth ----------------------------
-- Cuando alguien se registra en auth.users, se crea su fila en public.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'display_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- El enlace con auth.users y el trigger solo se crean si el esquema "auth" existe.
-- (Prisma prueba cada migración en una base "sombra" temporal que NO tiene "auth":
--  sin esta guarda, "prisma migrate dev" fallaría. En Supabase real sí se crean.)
DO $do$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$do$;