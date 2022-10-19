import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events } from './events.entity';

import { Profiles } from 'src/profiles/profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Events, Profiles])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
