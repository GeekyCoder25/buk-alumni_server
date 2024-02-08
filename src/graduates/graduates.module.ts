import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/graduate.schema';
import { GraduatesController } from './graduates.controller';
import { GraduatesService } from './graduates.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
  ],
  providers: [GraduatesService, CloudinaryService],
  controllers: [GraduatesController],
})
export class GraduatesModule {}
