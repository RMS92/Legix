import { Injectable } from '@nestjs/common';
import { CreateScanDto } from './dto/create-scan.dto';
import { UpdateScanDto } from './dto/update-scan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Scan, ScanDocument } from './schemas/scan.schema';
import { FilesService } from '../files/files.service';
const { ObjectId } = require('mongodb');

@Injectable()
export class ScansService {
  constructor(
    @InjectModel('Scan') private readonly scanModel: Model<ScanDocument>,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createScanDto: CreateScanDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ): Promise<Scan> {
    const data = { user: userId, ...createScanDto };
    // Save scan
    const newScan = new this.scanModel(data);
    // Save files
    const scanFiles = await this.filesService.saveFiles(files, newScan._id);
    // Associate file ids to  current scan
    Object.assign(newScan, { scanFiles: scanFiles });
    return newScan.save();
  }

  async findAll(): Promise<Scan[]> {
    return this.scanModel
      .find()
      .populate({ path: 'user', select: 'username' })
      .populate({ path: 'scanFiles' });
  }

  async findAllByUser(id: string): Promise<Scan[]> {
    return this.scanModel
      .find({ user: ObjectId(id) }, null, null)
      .sort({ created_at: -1 })
      .populate({ path: 'user', select: 'username' })
      .populate({ path: 'scanFiles', select: 'current_filename' });
  }

  async findLatest(): Promise<Scan[]> {
    return this.scanModel
      .find({ is_visible: true, status: { $ne: 1 } })
      .sort({ created_at: -1 })
      .limit(100)
      .populate({ path: 'user', select: 'username' })
      .populate({ path: 'scanFiles', select: 'current_filename' });
  }

  async findOne(id: string): Promise<Scan> {
    return this.scanModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'username' })
      .populate({ path: 'scanFiles', select: 'current_filename status' });
  }

  async update(
    id: string,
    updateScanDto: UpdateScanDto,
    files: Array<Express.Multer.File>,
  ): Promise<Scan> {
    const updatedScan = await this.scanModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'username' });
    // Delete all files associated with scan
    if (files && files.length !== 0) {
      for (const fileId of updatedScan.scanFiles) {
        await this.filesService.remove(
          updatedScan.user.username,
          String(fileId),
        );
      }
      // Save new files files
      const scanFiles = await this.filesService.saveFiles(
        files,
        updatedScan._id,
      );
      // Update scan
      delete updatedScan.scanFiles;
      Object.assign(updatedScan, { scanFiles: scanFiles });
    }
    // Add dto body updated scan
    Object.assign(updatedScan, updateScanDto);
    return this.scanModel.findByIdAndUpdate(updatedScan._id, updatedScan, {
      new: true,
    });
  }

  async remove(id: string): Promise<Scan> {
    const deletedScan = await this.scanModel
      .findByIdAndRemove({ _id: id })
      .populate({ path: 'user', select: 'username' });
    for (const fileId of deletedScan.scanFiles) {
      await this.filesService.remove(deletedScan.user.username, String(fileId));
    }
    return deletedScan;
  }
}
