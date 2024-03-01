import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post ,EditorVersion } from './post.schema';

@Injectable()
export class EditorService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async createPost(title: string, data: any): Promise<Post> {
    const newPost = new this.postModel({ title, data, versionHistory: [] });
    const savedPost = await newPost.save();
    return savedPost.toObject();
  }

  async updatePost(id: string, newData: any): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const newVersion: EditorVersion = {
      versionNumber: post.versionHistory.length + 1,
      title: post.title,
      data: newData,
      createdAt: new Date(),
    };

    post.versionHistory.push(newVersion);
    post.title = newVersion.title;
    post.data = newVersion.data;

    return await post.save().then(post => post.toObject());
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postModel.find().lean().exec();
  }

  async getPostById(id: string): Promise<Post> {
    return this.postModel.findById(id).lean().exec();
  }

  async getVersionHistory(id: string): Promise<EditorVersion[]> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post.versionHistory;
  }
}

