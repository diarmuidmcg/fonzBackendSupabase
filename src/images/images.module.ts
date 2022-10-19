import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
