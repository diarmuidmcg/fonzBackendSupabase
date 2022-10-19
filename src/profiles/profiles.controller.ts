import { ProfilesService } from './profiles.service';
import { Profiles } from './profiles.entity';
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

@Controller('profiles')
export class ProfilesController {
  constructor(public appService: ProfilesService) {}

  @Get('')
  // @UseGuards(AuthGuard('jwt'))
  async getProfiles(@Req() request, @Res() response) {
    return await this.appService.getProfiles(request, response);
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  async getSingleProfile(@Req() request, @Res() response) {
    return await this.appService.getSingleProfile(request, response);
  }

  @Post('')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('file'))
  async createProfile(@Req() request, @Res() response) {
    return await this.appService.createProfile(request, response);
  }

  @Put(':id')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('file'))
  async updateProfile(@Req() request, @Res() response) {
    return await this.appService.updateProfile(request, response);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  async deleteProfile(@Req() request, @Res() response) {
    return await this.appService.deleteProfile(request, response);
  }
}
