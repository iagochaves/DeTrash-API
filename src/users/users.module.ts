import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/multer.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      cache: true,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
