import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { CacheModule,CacheInterceptor } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { RedisOptions } from './config/app-options.constants';
import { APP_INTERCEPTOR } from '@nestjs/core';
import TypeOrmConfig from './ormconfig'

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), GraphqlModule, TaskModule, BookingModule, UserModule,
  ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ],
})
export class AppModule { }
