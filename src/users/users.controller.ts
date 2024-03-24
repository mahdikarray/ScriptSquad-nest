/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AuthDto } from './../auth/dto/auth.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Put, Query } from '@nestjs/common/decorators';


@Controller({
  path: 'users',
  version: '1.0',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('data/admin')
  async createAdmin(@Body() createUserDto: AuthDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() q: string) {
    return await this.usersService.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }



  @Put('update-nom/:id')
    async updateFullName(@Param('id') userId: string, @Body('full_name') fullName: string): Promise<void> {
        try {
            await this.usersService.updateOne(userId, { full_name: fullName });
        } catch (error) {
            if (error instanceof NotFoundException) {
                // Gérer l'erreur de l'ID de l'utilisateur non trouvé
                throw new NotFoundException('Utilisateur non trouvé.');
            } else {
                // Gérer d'autres erreurs
                throw new Error('Une erreur est survenue lors de la mise à jour du nom de l\'utilisateur.');
                console.log(error);
            }
        }
    }
}
 

