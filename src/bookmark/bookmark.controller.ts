import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { GetUser, Roles } from '../auth/decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@UseGuards(JwtGuard, RolesGuard)
@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async getAllBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Get(':title')
  @HttpCode(HttpStatus.OK)
  async getBookmarkByTitle(
    @GetUser('id') userId: number,
    @Param('title') title: string,
  ) {
    return this.bookmarkService.getBookmarkByTitle(userId, title);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateBookmarkDto })
  @ApiResponse({
    status: 201,
    description: 'The bookmark has been successfully created.',
  })
  async createBookmark(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, createBookmarkDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(
      userId,
      bookmarkId,
      updateBookmarkDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
