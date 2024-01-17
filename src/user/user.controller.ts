import {
  Get,
  Controller,
  UseGuards,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { GenericRequest, GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard'; // * use relative paths
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { extname, join } from 'path';
import * as os from 'os';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { CreateBookmarkDto } from '../bookmark/dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly config: ConfigService,
  ) {}

  @Post(':userId/upload')
  @ApiOperation({ summary: 'Upload User Image by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: () => CreateBookmarkDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadFolder = 'userImageUploads\\'; // Folder name
          const destinationPath = join(os.homedir(), uploadFolder);
          return cb(null, destinationPath);
        }, // Set the destination folder
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @Body() user: CreateBookmarkDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: number,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const maxFileSize = 3 * 1024 * 1024; // 3 MB
    if (file.size > maxFileSize)
      throw new BadRequestException('File size exceeds the limit of 3 MB');

    const imagePath = `${file.filename}`;
    const uploadFolder = 'userImageUploads\\'; // Folder name
    const destinationPath = join(os.homedir(), uploadFolder);

    await this.userService.updateUserImage(userId, imagePath, destinationPath);

    return { message: 'File uploaded successfully', path: imagePath };
  }

  @ApiOperation({ summary: 'Get User Image by ID' })
  @ApiResponse({
    status: 200,
    description: 'User image retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User or user image not found' })
  @Get(':userId/image')
  async getUserImage(@Param('userId') userId: number, @Res() res: any) {
    const user = await this.userService.getUserById(userId);

    if (!user || !user.image) {
      return res.status(404).json({ message: 'User or user image not found' });
    }

    const imagePath = join(os.homedir(), 'userImageUploads', user.image);

    res.setHeader('Content-Type', 'image/*');
    res.setHeader('Content-Disposition', `inline; filename=${user.image}`);

    // Use Node.js stream to send the image file to the response
    const stream = createReadStream(imagePath);
    stream.pipe(res);
  }

  // * Generic request is a decorator that returns the user object from the request object. We made it generic because nest works with express and another framework which I forgot, and we let it decide whatever to use (I think by default, express)
  // * See the custom decorator in the auth folder for more info.

  // * The user object which we are returning is defined in jwt.strategy.ts
  // * The JwtGuard is a guard that checks if the user is authenticated. If the user is, it will return the user object. If not, it will throw an error.

  @UseGuards(JwtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GenericRequest() request: any /* @GetUser('email') email: string*/) {
    // console.log({
    //   email,
    // });
    return request.user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMe(@GetUser('id') id: number, @Body() dto: EditUserDto) {
    return await this.userService.updateUser(id, dto);
  }
}
