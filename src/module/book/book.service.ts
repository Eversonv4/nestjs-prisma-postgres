import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BookDto } from './dtos/book.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(data: BookDto) {
    const bookExists = await this.prisma.book.findFirst({
      where: {
        bar_code: data.bar_code,
      },
    });

    if (bookExists) {
      throw new BadRequestException('Book already exists');
    }

    const book = await this.prisma.book.create({
      data,
    });

    return book;
  }

  async findAll() {
    return await this.prisma.book.findMany();
  }

  async update(id: string, data: BookDto) {
    const bookExists = await this.prisma.book.findUnique({ where: { id } });

    if (!bookExists) {
      throw new BadRequestException('Book does not exists!');
    }

    await this.prisma.book.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    const bookExists = await this.prisma.book.findUnique({ where: { id } });

    if (!bookExists) {
      throw new BadRequestException('Book does not exists!');
    }

    return await this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
