import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BmsModule } from './modules/bms/bms.module';
import { MoviesModule } from './modules/movies/movies.module';
import { DistributorsModule } from './modules/distributors/distributors.module';
import { TheatersModule } from './modules/theaters/theaters.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    BmsModule,
    MoviesModule,
    DistributorsModule,
    TheatersModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
