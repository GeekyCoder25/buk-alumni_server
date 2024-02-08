import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GraduatesService } from './graduates.service';
import { User } from './schemas/graduate.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { randomUUID } from 'crypto';

interface PaginateUser {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  data: User[];
}

interface QueryOptions {
  limit: string;
  page: string;
  start: string;
  end: string;
  graduate_year: DateQuery;
  name: string;
  cgpa: string;
}

interface DateQuery {
  $gte?: number;
  $lte?: number;
}

@Controller('graduates')
export class GraduatesController {
  constructor(
    private graduateService: GraduatesService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createUser(
    @Body() body: { data: string },
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const usersData = JSON.parse(body.data) as User;
    if (file) {
      if (!file.mimetype.startsWith('image')) {
        throw new HttpException(
          'File uploaded is not an image',
          HttpStatus.BAD_REQUEST,
        );
      } else if (file.size > 5 * 1024 * 1024) {
        throw new HttpException(
          'Please upload an image less than 5MB',
          HttpStatus.BAD_REQUEST,
        );
      }

      const saveFileName = `user_photo_${randomUUID()}`;
      return await this.cloudinary
        .uploadImage(file, saveFileName)
        .then((result) =>
          this.graduateService.create({
            ...usersData,
            photo_url: result.secure_url,
          }),
        )
        .catch(() => {
          throw new HttpException(
            'Error uploading file to server',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    } else {
      return this.graduateService.create(usersData);
    }
  }

  @Get()
  async findUser(@Query() query: QueryOptions): Promise<PaginateUser> {
    const { limit = 25, page = 1 } = query;

    const skip = (Number(page) - 1 >= 0 ? Number(page) - 1 : 0) * Number(limit);

    let name;

    if (query.name) {
      name = { $regex: query.name, $options: 'i' };
    }

    const arrayQueries: {
      full_name?: any;
      $or?: {
        cgpa: {
          $gt?: number;
          $lte?: number;
        };
      }[];
    } = {};

    if (query.name) {
      arrayQueries.full_name = name;
    }

    if (query.cgpa) {
      let cgpa = [];

      if (query.cgpa.includes('First Class Honours')) {
        cgpa = [{ cgpa: { $gt: 4.5, $lte: 5.0 } }];
      }
      if (query.cgpa.includes('Second Class Upper')) {
        cgpa = [...cgpa, { cgpa: { $gt: 3.0, $lte: 4.5 } }];
      }
      if (query.cgpa.includes('Second Class Lower')) {
        cgpa = [...cgpa, { cgpa: { $gt: 2.5, $lte: 3.0 } }];
      }
      if (query.cgpa.includes('Third Class')) {
        cgpa = [...cgpa, { cgpa: { $gt: 2.0, $lte: 2.5 } }];
      }
      if (query.cgpa.includes('Pass')) {
        cgpa = [...cgpa, { cgpa: { $gt: 1.0, $lte: 2.0 } }];
      }
      if (query.cgpa.includes('On God')) {
        cgpa = [...cgpa, { cgpa: { $gt: 0, $lte: 1.0 } }];
      }
      if (cgpa.length) {
        arrayQueries.$or = cgpa;
      }
    }

    delete query.limit;
    delete query.page;
    delete query.start;
    delete query.end;
    delete query.name;
    delete query.cgpa;

    Object.entries(query).map(
      (query) => (arrayQueries[query[0]] = query[1].split(',')),
    );

    const data = await this.graduateService.findUser(
      arrayQueries,
      Number(skip),
      Number(limit),
    );

    const total = await this.graduateService.countUser(arrayQueries);

    return {
      page: Number(page) || 1,
      pageSize: data.length,
      totalPages: total / Number(limit),
      total,
      data,
    };
  }
}
