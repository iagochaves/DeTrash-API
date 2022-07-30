import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [DatabaseModule, UsersModule, FormsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
