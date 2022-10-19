import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Organizations } from './organizations.entity';

import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

import { Profiles } from 'src/profiles/profiles.entity';
import { Events } from 'src/events/events.entity';

@Module({
  imports: [
    ImagesModule,
    TypeOrmModule.forFeature([Organizations, Events, Image, Profiles]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ImagesService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
