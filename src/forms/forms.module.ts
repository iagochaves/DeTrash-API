import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { ConfigModule } from '@nestjs/config';
import { FormsService } from './services/forms.service';
import { S3Service } from './services/s3.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
  controllers: [FormsController],
  providers: [FormsService, S3Service],
})
export class FormsModule {}
