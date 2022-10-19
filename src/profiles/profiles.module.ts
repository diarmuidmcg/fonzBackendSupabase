import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profiles } from './profiles.entity';

import { Events } from 'src/events/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles, Events])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
