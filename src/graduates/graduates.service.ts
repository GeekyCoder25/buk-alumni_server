import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/graduate.schema';
import { Model } from 'mongoose';

@Injectable()
export class GraduatesService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: User): Promise<User> {
    createUserDto.full_name = `${createUserDto.first_name} ${createUserDto.last_name}`;
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUser(query: any, skip: number, limit: number): Promise<User[]> {
    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ graduate_year: -1 });
    const usersWithSerialNumber = users.map((user, index) => ({
      sn: skip + index + 1,
      ...user.toObject(),
    }));

    return usersWithSerialNumber;
  }

  countAllUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  countUser(query: any): Promise<number> {
    return this.userModel.find(query).countDocuments();
  }
}
