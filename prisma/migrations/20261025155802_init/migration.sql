-- CreateEnum
CREATE TYPE "weight_unit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "recurrence_frequency" AS ENUM ('DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(80),
    "avatar_url" TEXT,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
    "locale" VARCHAR(10) NOT NULL DEFAULT 'es',
    "week_starts_on" SMALLINT NOT NULL DEFAULT 1,
    "preferred_weight_unit" "weight_unit" NOT NULL DEFAULT 'KG',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "default_reminder_minutes" SMALLINT DEFAULT 10,
    "daily_summary_time" TIME(0),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SMALLSERIAL NOT NULL,
    "key" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" CHAR(7) NOT NULL,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "category_id" SMALLINT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(1000),
    "scheduled_date" DATE NOT NULL,
    "start_time" TIME(0),
    "duration_minutes" SMALLINT,
    "reminder_minutes" SMALLINT,
    "completed_at" TIMESTAMPTZ(6),
    "recurrence_id" UUID,
    "occurrence_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_reschedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "activity_id" UUID NOT NULL,
    "from_date" DATE NOT NULL,
    "from_time" TIME(0),
    "to_date" DATE NOT NULL,
    "to_time" TIME(0),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_reschedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_recurrences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "category_id" SMALLINT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(1000),
    "start_time" TIME(0),
    "duration_minutes" SMALLINT,
    "reminder_minutes" SMALLINT,
    "frequency" "recurrence_frequency" NOT NULL,
    "interval_count" SMALLINT NOT NULL DEFAULT 1,
    "days_of_week" SMALLINT[],
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "generated_until" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "activity_recurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "muscle_group" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "activity_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "ended_at" TIMESTAMPTZ(6),
    "notes" VARCHAR(1000),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_session_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL,
    "notes" VARCHAR(500),

    CONSTRAINT "workout_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_exercise_id" UUID NOT NULL,
    "set_number" SMALLINT NOT NULL,
    "reps" SMALLINT,
    "weight_value" DECIMAL(7,2),
    "weight_unit" "weight_unit",
    "duration_seconds" INTEGER,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "workout_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_key_key" ON "categories"("key");

-- CreateIndex
CREATE INDEX "activities_user_id_scheduled_date_start_time_idx" ON "activities"("user_id", "scheduled_date", "start_time");

-- CreateIndex
CREATE INDEX "activities_user_id_completed_at_idx" ON "activities"("user_id", "completed_at");

-- CreateIndex
CREATE INDEX "activities_user_id_category_id_scheduled_date_idx" ON "activities"("user_id", "category_id", "scheduled_date");

-- CreateIndex
CREATE UNIQUE INDEX "activities_recurrence_id_occurrence_date_key" ON "activities"("recurrence_id", "occurrence_date");

-- CreateIndex
CREATE INDEX "activity_reschedules_activity_id_created_at_idx" ON "activity_reschedules"("activity_id", "created_at");

-- CreateIndex
CREATE INDEX "activity_recurrences_user_id_deleted_at_idx" ON "activity_recurrences"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "exercises_user_id_name_idx" ON "exercises"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "workout_sessions_activity_id_key" ON "workout_sessions"("activity_id");

-- CreateIndex
CREATE INDEX "workout_session_exercises_exercise_id_idx" ON "workout_session_exercises"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_session_exercises_session_id_position_key" ON "workout_session_exercises"("session_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "workout_sets_session_exercise_id_set_number_key" ON "workout_sets"("session_exercise_id", "set_number");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_recurrence_id_fkey" FOREIGN KEY ("recurrence_id") REFERENCES "activity_recurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_reschedules" ADD CONSTRAINT "activity_reschedules_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_recurrences" ADD CONSTRAINT "activity_recurrences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_recurrences" ADD CONSTRAINT "activity_recurrences_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_session_exercise_id_fkey" FOREIGN KEY ("session_exercise_id") REFERENCES "workout_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
