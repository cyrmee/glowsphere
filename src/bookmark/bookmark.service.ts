import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private glowsphereDb: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.glowsphereDb.bookmark.findMany({
      where: { userId: userId },
      include: {
        user: true,
      },
    });

    bookmarks.forEach((bookmark) => delete bookmark.user.hash);
    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.glowsphereDb.bookmark.findUnique({
      where: { id: bookmarkId, userId: userId },
      include: {
        user: true,
      },
    });

    delete bookmark.user.hash;
    return bookmark;
  }

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.glowsphereDb.bookmark.create({
      data: {
        userId: userId,
        ...createBookmarkDto,
      },
      include: {
        user: true,
      },
    });

    delete bookmark.user.hash;
    return bookmark;
  }

  async updateBookmark(
    userId: number,
    bookmarkId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.glowsphereDb.bookmark.update({
      where: { id: bookmarkId, userId: userId },
      data: {
        ...updateBookmarkDto,
      },
      include: {
        user: true,
      },
    });

    delete bookmark.user.hash;
    return bookmark;
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.glowsphereDb.bookmark.delete({
      where: { id: bookmarkId, userId: userId },
    });
    return bookmark;
  }
}
