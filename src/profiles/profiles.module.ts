import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profiles } from './profiles.entity';

import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

import { Events } from 'src/events/events.entity';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [
    ImagesModule,
    TypeOrmModule.forFeature([Profiles, Image, Events, Organizations]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ImagesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
