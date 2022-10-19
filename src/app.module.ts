import { config } from './orm.config';

// for logging
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerConfig } from 'src/LoggerConfig';
const logger: LoggerConfig = new LoggerConfig();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProfilesModule } from './profiles/profiles.module';

import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    WinstonModule.forRoot(logger.console()),
    ProfilesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
