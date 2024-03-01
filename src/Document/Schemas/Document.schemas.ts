import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// DocumentVersion sera utilisé dans le service, donc nous le déclarons ici aussi
export interface DocumentVersion {
  versionNumber: number;
  name: string;
  title: string;
  state: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Schema()
export class Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: true })
  state: boolean;

  @Prop({ required: true }) // Ajouter le champ pour l'email de l'utilisateur
  userEmail: string;

  @Prop({ type: [Object] }) // Utiliser un tableau d'objets génériques
  versionHistory: DocumentVersion[]; // Ne pas utiliser type: [DocumentVersion]
  
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
