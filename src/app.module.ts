import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportEntity } from './reports/report.entity';
import { ReportsModule } from './reports/reports.module';
import { UserEntity } from './users/user.entity';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DB_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_LOGGING: Joi.boolean().required(),
        DB_SYNCHRONIZATION: Joi.boolean().required(),
        COOKIE_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          post: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [UserEntity, ReportEntity],
          synchronize: config.get<boolean>('DB_SYNCHRONIZATION'),
          logging: config.get<boolean>('DB_LOGGING'),
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [UserEntity, ReportEntity],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')],
      }),
    );
  }
}
