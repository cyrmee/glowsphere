import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';
import { CommonService } from '../common/common.service';

@Injectable()
export class UserService {
  constructor(
    private glowsphereDb: PrismaService,
    private readonly common: CommonService,
  ) {}

  // async getUser(id: number) {}

  // async getUsers() {}

  // async createUser() {}

  async getUserById(userId: number) {
    const user = await this.glowsphereDb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateUserImage(
    userId: number,
    imageName: string,
    fullPath: string,
  ): Promise<User> {
    try {
      let user = await this.glowsphereDb.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException(`No student found with ${userId}`);

      console.log(`${fullPath}${user.image}`);

      if (
        user.image &&
        (await this.common.fileExistsAsync(`${fullPath}${user.image}`))
      ) {
        console.log('File exists, deleting file...');
        await this.common.deleteFileAsync(`${fullPath}${user.image}`);
      } else {
        console.log('File does not exist');
      }

      user = await this.glowsphereDb.user.update({
        where: { id: userId },
        data: { image: imageName },
      });

      return user;
    } catch (error) {
      if (error.response.statusCode === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(id: number, dto: EditUserDto) {
    const user = await this.glowsphereDb.user.update({
      where: { id },
      data: { ...dto },
    });
    delete user.hash;
    return user;
  }
}
