import { Injectable } from '@nestjs/common';
import { CreateScanFileDto } from './dto/create-scan-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema, Types } from 'mongoose';
import { ScanFile, ScanFileDocument } from './schemas/scan-file.schema';
import { ScansService } from '../scans/scans.service';
import { ConfigService } from '@nestjs/config';
import { UpdateScanFileDto } from './dto/update-scan-file.dto';
const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class FilesService {
  constructor(
    @InjectModel('ScanFile')
    private readonly scanFileModel: Model<ScanFileDocument>,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return this.scanFileModel.find();
  }

  async findAllByScan() {
    return this.scanFileModel.find().populate('scan');
  }

  findOne(id: string) {
    return this.scanFileModel.findOne({ _id: id });
  }

  async update(id: string, updateScanFileDto: UpdateScanFileDto) {
    return this.scanFileModel.findByIdAndUpdate(
      { _id: id },
      updateScanFileDto,
      { new: true },
    );
  }

  async remove(username: string, id: string) {
    await this.removeFile(username, id);
    return this.scanFileModel.findByIdAndRemove({ _id: id });
  }

  async saveFiles(files, scanId: string): Promise<ObjectId[]> {
    const scanFiles: ObjectId[] = [];
    for (const file of files) {
      const { originalname, filename, mimetype, size } = file;
      const extension = mimetype.split('/')[1];
      const newScanFile = new this.scanFileModel({
        original_filename: originalname,
        current_filename: filename,
        extension,
        size,
        scan: scanId,
      });
      await newScanFile.save();
      scanFiles.push(newScanFile._id);
    }
    return scanFiles;
  }

  async removeFile(username: string, fileId) {
    const unlinkAsync = promisify(fs.unlink);
    const file = await this.scanFileModel.findOne({ _id: fileId });
    const { current_filename } = file;
    await unlinkAsync(
      this.configService.get<string>('UPLOADS_PATH') +
        `/scans/${username}/` +
        current_filename,
    );
  }
}
