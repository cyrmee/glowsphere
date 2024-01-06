import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class BookmarkReadDto {
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNotEmpty()
    @IsString()
    link: string;
  }