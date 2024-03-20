import { Injectable } from '@nestjs/common';
import { Event } from './event.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb'; // Utilisez ObjectId de mongodb

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}
  

  async create(event: Event): Promise<Event> {
    const newEvent = new this.eventModel(event);
    return await newEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return await this.eventModel.find().exec();
  }

  async remove(id: string): Promise<Event> {
    // Convertir l'ID en ObjectId
    const objectId = new ObjectId(id);

    // Utiliser l'ID converti pour supprimer l'événement
    return await this.eventModel.findByIdAndDelete(objectId);
  }

  async update(id: string, updatedEvent: Event): Promise<Event> {
    const objectId = new ObjectId(id);
    return await this.eventModel.findByIdAndUpdate(objectId, updatedEvent, { new: true });
  }
}
