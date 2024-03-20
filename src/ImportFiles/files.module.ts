import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileImport, FileSchema } from './file.schemas';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FileImport.name,
        schema: FileSchema,
      },
    ]),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}