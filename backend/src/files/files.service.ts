import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ScanFile, ScanFileDocument } from './schemas/scan-file.schema';
import { ConfigService } from '@nestjs/config';
import { UpdateScanFileDto } from './dto/update-scan-file.dto';
import { AvatarFile, AvatarFileDocument } from './schemas/avatar-file.schema';

const fs = require('fs');
const { promisify } = require('util');

@Injectable()
export class FilesService {
  constructor(
    @InjectModel('ScanFile')
    private readonly scanFileModel: Model<ScanFileDocument>,
    @InjectModel('AvatarFile')
    private readonly avatarFileModel: Model<AvatarFileDocument>,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    return this.scanFileModel.find();
  }

  async findAllByScan() {
    return this.scanFileModel.find().populate('scan');
  }

  async findOne(id: string) {
    return this.scanFileModel.findOne({ _id: id });
  }

  async findOneAvatarFile(id: string): Promise<AvatarFile> {
    return this.avatarFileModel.findOne({ _id: id });
  }

  async update(id: string, updateScanFileDto: UpdateScanFileDto) {
    return this.scanFileModel.findByIdAndUpdate(
      { _id: id },
      updateScanFileDto,
      { new: true },
    );
  }

  async saveAvatarFile(file): Promise<AvatarFile> {
    const { originalname, filename, mimetype, size } = file;
    const extension = mimetype.split('/')[1];
    const newAvatarFile = new this.avatarFileModel({
      original_filename: originalname,
      current_filename: filename,
      extension,
      size,
      created_at: Date.now(),
    });
    return newAvatarFile.save();
  }

  async saveFiles(files, scanId: string): Promise<ObjectId[]> {
    const scanFiles: ObjectId[] = [];
    let position: number = 1;
    for (const file of files) {
      const { originalname, filename, mimetype, size } = file;
      const extension = mimetype.split('/')[1];
      const newScanFile = new this.scanFileModel({
        original_filename: originalname,
        current_filename: filename,
        extension,
        position,
        size,
        scan: scanId,
        created_at: Date.now(),
      });
      await newScanFile.save();
      scanFiles.push(newScanFile._id);
      // Increment position
      position += 1;
    }
    return scanFiles;
  }

  async remove(username: string, id: string) {
    await this.removeFile(username, id);
    return this.scanFileModel.findByIdAndRemove({ _id: id });
  }

  async removeAvatarFile(username: string, id: string): Promise<AvatarFile> {
    await this.unlinkAvatarFile(username, id);
    return this.avatarFileModel.findByIdAndRemove({ _id: id });
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

  async unlinkAvatarFile(username: string, fileId) {
    const unlinkAsync = promisify(fs.unlink);
    const file = await this.avatarFileModel.findOne({ _id: fileId });
    const { current_filename } = file;
    await unlinkAsync(
      this.configService.get<string>('UPLOADS_PATH') +
        `/profil/${username}/` +
        current_filename,
    );
  }
}
