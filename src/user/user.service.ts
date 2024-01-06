import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private glowsphereDb: PrismaService) {}

  async getUser(id: number) {}

  async getUsers() {}

  async createUser() {}

  async updateUser(id: number, dto: EditUserDto) {
    const user = await this.glowsphereDb.user.update({
      where: { id },
      data: { ...dto },
    });
    delete user.hash;
    return user;
  }
}
