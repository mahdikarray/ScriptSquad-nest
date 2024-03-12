/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './repository/user.repostory';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from 'src/auth/dto/update-password.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: AuthDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    createUserDto.isVerify=false;
    const createdUser = await this.userRepository.create(createUserDto);
    return createdUser;
  }

  async findAll(q: any): Promise<User[]> {
    return await this.userRepository.findAll(q);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findUserByEmail(email);
  }

  


  async updateOne(userId: string, data: UpdateUserDto) {
    await this.userRepository.updateOne(userId, data);
  }

  async findById(userId: string) {
    return await this.userRepository.findById(userId);
  }

  async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }


  async updatePassword(email: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
    }
    user.password = newPassword;
    await this.userRepository.save(user);   
    return user;
}



  findOneAndUpdate(query: any, update: any, options: any){
    return this.userRepository.findOneAndUpdate(query, update, options)
  }



}
