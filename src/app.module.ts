import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceModule } from './workspace/workspace.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest?directConnection=true'), WorkspaceModule,
],
 
})
export class AppModule {}