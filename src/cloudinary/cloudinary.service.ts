import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadImage(
    file: Express.Multer.File,
    saveFileName,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const base64String = file.buffer.toString('base64');
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64String}`,
        { public_id: saveFileName, folder: 'buk-alumni/usersIcon' },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        },
      );
    });
  }
}
