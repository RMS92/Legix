import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
const { ObjectId } = require('mongodb');

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment')
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const data = {
      author: userId,
      created_at: Date.now(),
      ...createCommentDto,
    };
    const newComment = new this.commentModel(data);
    await newComment.save();
    return this.commentModel
      .findOne({ _id: newComment._id })
      .populate({ path: 'author', select: 'username -_id' })
      .populate({ path: 'parent', select: '_id' })
      .populate({ path: 'scan', select: '_id' });
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel
      .find()
      .populate({ path: 'author', select: 'username -_id' })
      .populate({ path: 'parent', select: '_id' })
      .populate({ path: 'scan', select: '_id' });
  }

  async findAllByScan(id: string): Promise<Comment[]> {
    return this.commentModel
      .find({ scan: ObjectId(id) }, null, null)
      .populate({ path: 'author', select: 'username -_id' })
      .populate({ path: 'parent', select: '_id' })
      .populate({ path: 'scan', select: '_id' });
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentModel.findOne({ _id: id });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Comment> {
    const commentToDelete = await this.commentModel.findByIdAndRemove({
      _id: id,
    });
    await this.removeChildren(commentToDelete.replies);
    return commentToDelete;
  }

  async removeChildren(children: Comment[]) {
    if (children && children.length > 0) {
      for (const child of children) {
        const childComment = await this.commentModel.findByIdAndRemove({
          _id: child,
        });
        if (
          childComment &&
          childComment.replies &&
          childComment.replies.length > 0
        ) {
          await this.removeChildren(childComment.replies);
        }
      }
    }
  }
}
