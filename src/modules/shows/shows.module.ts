import { Module } from '@nestjs/common';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';
import { MoviesModule } from '../movies/movies.module';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, MoviesModule, AuthModule],
  controllers: [ShowsController],
  providers: [ShowsService],
})
export class ShowsModule {}
