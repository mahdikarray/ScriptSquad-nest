import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './repository/user.repostory';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from 'src/workspace/workspace.schema';
import { Model } from 'mongoose';
import { MailService } from './mail/mail.service';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  @InjectModel(Workspace.name) private readonly workspaceModel: Model<Workspace>,private readonly mailService: MailService) {}

  async create(createUserDto: any): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);

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

  async addWorkspaceToUserRole(userEmail: string, workspaceName: string): Promise<User> {
    // Find the user by ID
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the workspace exists
    const workspace = await this.workspaceModel.findOne({ name: workspaceName });
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Add workspace name to user roles if not already present
    if (!user.role.includes(workspaceName)) {
      await this.mailService.sendWorkspaceInvitation(userEmail, workspaceName); // Assuming you have a method in your mail service to send the invitation

      user.role.push(workspaceName);
    } else {
      throw new Error('Workspace already added to user role');
    }

    // Save the updated user
    return await user.save();
  }
}
