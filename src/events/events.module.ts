import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events } from './events.entity';

import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

import { Profiles } from 'src/profiles/profiles.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [
    ImagesModule,
    TypeOrmModule.forFeature([Events, Image, Profiles, Organizations]),
  ],
  controllers: [EventsController],
  providers: [EventsService, ImagesService],
  exports: [EventsService],
})
export class EventsModule {}
