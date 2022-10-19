import { EventsService } from './events.service';
import { Events } from './events.entity';
// import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Res,
  Body,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
} from '@nestjs/common';
import { request, response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(public appService: EventsService) {}

  @Get('')
  // @UseGuards(AuthGuard('jwt'))
  async getEvents(@Req() request, @Res() response) {
    return await this.appService.getEvents(request, response);
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  async getSingleEvent(@Req() request, @Res() response) {
    return await this.appService.getSingleEvent(request, response);
  }

  @Post('')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('file'))
  async createEvent(
    @Req() request,
    @Res() response,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    return await this.appService.createEvent(files, request, response);
  }

  @Put(':id')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('file'))
  async updateEvent(
    @Req() request,
    @Res() response,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    return await this.appService.updateEvent(files, request, response);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  async deleteEvent(@Req() request, @Res() response) {
    return await this.appService.deleteEvent(request, response);
  }
}
