import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';
import { DocumentsService } from 'src/services/documents.service';
import { FormsService } from 'src/services/forms.service';
import { S3Service } from 'src/services/s3.service';
import { UsersService } from 'src/services/users.service';
import { DatabaseModule } from '../database/database.module';
import { AuthorizationGuard } from './auth/authorization.guard';
import { DocumentsResolver } from './graphql/resolvers/documents.resolver';
import { FormsResolver } from './graphql/resolvers/forms.resolver';
import { MeResolver } from './graphql/resolvers/me.resolver';
import { UsersResolver } from './graphql/resolvers/users.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      playground: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },

    // Resolvers
    DocumentsResolver,
    UsersResolver,
    FormsResolver,
    MeResolver,

    // Services
    DocumentsService,
    UsersService,
    FormsService,
    S3Service,
  ],
})
export class HttpModule {}
