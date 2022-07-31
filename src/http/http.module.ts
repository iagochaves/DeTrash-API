import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';
import { FormsService } from 'src/services/forms.service';
import { S3Service } from 'src/services/s3.service';
import { UsersService } from 'src/services/users.service';
import { DatabaseModule } from '../database/database.module';
import { FormsResolver } from './graphql/resolvers/forms.resolver';
import { UsersResolver } from './graphql/resolvers/users.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
      driver: ApolloFederationDriver,
    }),
  ],
  providers: [
    // Resolvers
    UsersResolver,
    FormsResolver,

    // Services
    UsersService,
    FormsService,
    S3Service,
  ],
})
export class HttpModule {}
