import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, EditorVersion, PostDocument } from './post.schema';
import { Multer } from 'multer';
import { Stream } from 'stream';
import * as path from 'path';
import * as BufferList from 'bl';
import axios from 'axios';
import * as fs from 'fs';
import { GridFSBucket, ObjectId } from 'mongodb';
@Injectable()
export class EditorService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

  async createPost(title: string, data: any): Promise<PostDocument> {
    const newPost = new this.postModel({ title, data, versionHistory: [] });
    const savedPost = await newPost.save();
    return savedPost;
  }

  async updatePost(id: string, newData: any): Promise<PostDocument> {
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

    return await post.save();
  }

  async getAllPosts(): Promise<PostDocument[]> {
    return this.postModel.find().lean().exec();
  }

  async getPostById(id: string): Promise<PostDocument> {
    return this.postModel.findById(id).lean().exec();
  }

  async getVersionHistory(id: string): Promise<EditorVersion[]> {
    if (!id) {
      throw new NotFoundException('Invalid id');
    }
  
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    return post.versionHistory;
  }
  
  async clearHistory(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    post.versionHistory = [];
    return await post.save();
  }
  
}
