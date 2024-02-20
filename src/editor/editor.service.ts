import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class EditorService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async createPost(title: string, data: any): Promise<Post> {
    if (!title || !data) {
      throw new BadRequestException('Title and data are required');
    }

    const newPost = new this.postModel({ title, data });
    const savedPost = await newPost.save();
    return savedPost.toObject(); // Use toObject() to convert to plain JavaScript object
  }

  async updatePost(id: string, newData: any): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Merge the new data with the existing data
    post.data = { ...post.data, ...newData };

    return await post.save().then(post => post.toObject()); // Use toObject() to convert to plain JavaScript object
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postModel.find().lean().exec(); // Use lean() for better performance
  }

  async getPostById(id: string): Promise<Post> {
    return this.postModel.findById(id).lean().exec(); // Use lean() for better performance
  }
}

