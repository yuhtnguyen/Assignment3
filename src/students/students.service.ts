import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/schema/student.schema';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const existingStudent = await this.studentModel
        .findOne({ studentCode: createStudentDto.studentCode })
        .exec();

      if (existingStudent) {
        throw new ConflictException('Student already exists');
      }

      const newStudent = new this.studentModel({ ...createStudentDto });

      console.log('createdStudent', newStudent);

      await newStudent.save();

      const { _id, name, studentCode, isActive } = newStudent.toObject();

      return {
        success: true,
        message: 'Student created successfully',
        data: {
          _id,
          name,
          studentCode,
          isActive,
        },
      };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Validation failed');
    }
  }

  async getAll() {
    try {
      const students = await this.studentModel.find().exec();

      const formattedStudents = students.map((student) => {
        const { _id, name, studentCode, isActive } = student.toObject();
        return { _id, name, studentCode, isActive };
      });

      return {
        success: true,
        data: formattedStudents,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Something went wrong with the server',
        error,
      );
    }
  }

  async getById(id: string) {
    const student = await this.studentModel.findById(id).exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const { _id, name, studentCode, isActive } = student.toObject();

    return {
      success: true,
      data: {
        _id,
        name,
        studentCode,
        isActive,
      },
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const existingStudent = await this.studentModel.findById(id).exec();

      if (!existingStudent) {
        throw new NotFoundException('Student not found');
      }

      existingStudent.set(updateStudentDto);

      await existingStudent.save();

      const {_id, name, studentCode, isActive } = existingStudent.toObject();

      return {
        success: true,
        message: 'Student updated successfully',
        data: {
          _id,
          name,
          studentCode,
          isActive,
        },
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Validation failed');
    }
  }

  async delete(id: string) {
    try {
      const existingStudent = await this.studentModel.findById(id).exec();

      if (!existingStudent) {
        throw new NotFoundException('Student not found');
      }

      await this.studentModel.findByIdAndDelete(id).exec();

      return {
        success: true,
        message: 'Student deleted successfully',
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid student code format');
      }
      throw new InternalServerErrorException('Something went wrong on the server');
    }
  }
}
