import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: [true, 'First Name is required'] })
  first_name: string;

  @Prop({ required: [true, 'Last Name is required'] })
  last_name: string;

  @Prop({ required: [true, 'Full Name is required'] })
  full_name: string;

  @Prop({ required: [true, 'Graduate year is required'] })
  graduate_year: number;

  @Prop({ required: [true, 'Faculty is required'] })
  faculty: string;

  @Prop({ required: [true, 'Department is required'] })
  department: string;

  @Prop({ required: [true, 'CGPA is required'] })
  cgpa: number;

  @Prop()
  photo_url: string;

  @Prop()
  post: string;

  @Prop()
  nickname: string;

  @Prop()
  address: string;

  @Prop()
  dob: Date;

  @Prop({ required: [true, 'Phone number is required'] })
  phone_number: string;

  @Prop({ required: [true, 'User gender is required'] })
  gender: string;

  @Prop()
  favorite_moment_at_school: string;

  @Prop()
  where_they_are_now: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
