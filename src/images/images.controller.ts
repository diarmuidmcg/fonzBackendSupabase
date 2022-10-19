import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imageUploadService: ImagesService) {}

  // @Get('itemImages')

  @Get('')
  async getImages(@Req() request, @Res() response) {
    return await this.imageUploadService.getImages(request, response);
  }

  // @Delete('removeUpcycledImages')
  // async removeImage(@Req() request,
  // @Res() response){
  //   return await this.imageUploadService.removeUpcycledImages(request, response)
  // }

  // @Delete('removeDonatedImages')
  // async removeDonatedImage(){
  //   return await this.imageUploadService.removeDonatedImages()
  // }
}
