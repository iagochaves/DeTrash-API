import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';
import { FormsService } from 'src/services/forms.service';
import { S3Service } from 'src/services/s3.service';
import { UsersService } from 'src/services/users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthorizationGuard } from './auth/authorization.guard';
import { FormsResolver } from './graphql/resolvers/forms.resolver';
import { MeResolver } from './graphql/resolvers/me.resolver';
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
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },

    // Resolvers
    UsersResolver,
    FormsResolver,
    MeResolver,

    // Services
    UsersService,
    FormsService,
    S3Service,
  ],
})
export class HttpModule {}
