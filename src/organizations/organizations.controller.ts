import { OrganizationsService } from './organizations.service';
import { Organizations } from './organizations.entity';
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

@Controller('organizations')
export class OrganizationsController {
  constructor(public appService: OrganizationsService) {}

  @Get('')
  // @UseGuards(AuthGuard('jwt'))
  async getOrganizations(@Req() request, @Res() response) {
    return await this.appService.getOrganizations(request, response);
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  async getSingleOrganization(@Req() request, @Res() response) {
    return await this.appService.getSingleOrganization(request, response);
  }

  @Post('')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('file'))
  async createOrganization(
    @Req() request,
    @Res() response,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    return await this.appService.createOrganization(files, request, response);
  }

  @Put(':id')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('file'))
  async updateOrganization(
    @Req() request,
    @Res() response,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    return await this.appService.updateOrganization(files, request, response);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  async deleteOrganization(@Req() request, @Res() response) {
    return await this.appService.deleteOrganization(request, response);
  }
}
