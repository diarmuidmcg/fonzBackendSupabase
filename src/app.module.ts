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

import { Profiles } from './profiles/profiles.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesController } from './profiles/profiles.controller';

import { Events } from './events/events.entity';
import { EventsModule } from './events/events.module';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';

import { Organizations } from './organizations/organizations.entity';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationsService } from './organizations/organizations.service';
import { OrganizationsController } from './organizations/organizations.controller';

import { ImagesController } from './images/images.controller';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    WinstonModule.forRoot(logger.console()),
    ProfilesModule,
    EventsModule,
    OrganizationsModule,
    ImagesModule,

    TypeOrmModule.forFeature([Profiles, Events, Organizations]),
  ],
  controllers: [
    AppController,
    ProfilesController,
    EventsController,
    ImagesController,
    OrganizationsController,
  ],
  providers: [AppService, ProfilesService, EventsService, OrganizationsService],
})
export class AppModule {}
