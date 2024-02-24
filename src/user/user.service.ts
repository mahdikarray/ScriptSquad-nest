import { Injectable } from '@nestjs/common';

import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}
  async findOne(id: number) {
    return await this.userModel.findOne({ where: { _id: id } });
  }

  async findOneWithUserName(userName: string) {
    return await this.userModel.findOne({ where: { email: userName } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto); // Create a new user document instance
    await user.save(); // Save the new user to the database
    const { password, ...result } = user.toObject(); // Convert the user document to plain JavaScript object
    return result; // Return the created user without the password
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Assuming User schema has a field named 'id'
    return await this.userModel.updateOne({ id: id }, updateUserDto);
  }
}
