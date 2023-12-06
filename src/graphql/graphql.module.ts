import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TaskModule } from 'src/task/task.module';
import { BookingModule } from 'src/booking/booking.module';
import { DateScalar } from 'src/config/datetime.scalar';
import { DateTimeResolver } from 'graphql-scalars';

@Module({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        autoSchemaFile: 'src/schema.gql',
        // autoSchemaFile: true,
        include: [TaskModule, BookingModule],
        driver: ApolloDriver,
        playground: true,
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
        // resolvers: {
        //   DateTime: DateScalar,
        // },
        formatError: (error) => {
          const graphQLFormattedError = {
            message: error.message,
            code: error.extensions?.code || "SERVER_ERROR",
          };
          return graphQLFormattedError;
        },
      }),
    ],
  })
  export class GraphqlModule {}
