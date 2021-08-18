import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRolesUserDto } from './dto/updateRoles-user.dto';
import { FilesService } from '../files/files.service';

const { ObjectId } = require('mongodb');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly fileService: FilesService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async updateField(id: string, data: object): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateRoles(
    id: string,
    updateRolesUserDto: UpdateRolesUserDto,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateRolesUserDto, {
      new: true,
    });
  }

  async updateAvatarFile(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id })
      .populate({ path: 'avatarFile', select: '_id' });
    if (user.avatarFile) {
      await this.fileService.removeAvatarFile(
        user.username,
        user.avatarFile._id,
      );
    }
    const newAvatarFile = await this.fileService.saveAvatarFile(file);
    const { _id } = newAvatarFile;
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { avatarFile: ObjectId(_id) },
      { new: true },
    );
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove({ _id: id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }

  async mailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email: email });
    return !!user;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username: username });
    return !!user;
  }
}
