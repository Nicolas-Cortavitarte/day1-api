import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ActivitiesModule } from './activities/activities.module';
import { CategoriesModule } from './categories/categories.module';
import { ExercisesModule } from './excercise/exercises.module';

@Module({
  imports: [PrismaModule, AuthModule, ActivitiesModule, CategoriesModule, ExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
