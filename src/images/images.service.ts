import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Image } from './image.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
// for blob
import fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3({
      region: process.env.CLOUDWATCH_AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const bufferRep = dataBuffer;
    const uploadResult = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Body: bufferRep,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.imageRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.imageRepository.save(newFile);
    return newFile;
  }
  async uploadImageAsBlob(dataBuffer: Buffer, mimetype: string) {
    const s3 = new S3({
      region: process.env.CLOUDWATCH_AWS_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const uploadResult = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Body: dataBuffer,
        Key: `${uuid()}`,
        ContentType: mimetype,
      })
      .promise();

    const newFile = this.imageRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.imageRepository.save(newFile);
    return newFile;
  }

  async getImages(resquest, response) {
    const { offset, limit } = resquest.query;
    let images;

    if (offset != undefined && limit != undefined) {
      // get index
      // const place = offset * limit;
      images = await this.imageRepository.find({
        skip: offset,
        take: limit,
      });
    } else {
      console.log('getting all');
      images = await this.imageRepository
        .createQueryBuilder('images')
        .getMany();
    }
    return response.status(200).json(images);
  }
}
