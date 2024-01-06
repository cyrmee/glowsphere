import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

@Module({
    controllers: [BookmarkController],
    exports: [BookmarkService],
    imports: [],
    providers: [BookmarkService],
})
export class BookmarkModule {}
