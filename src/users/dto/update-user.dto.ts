import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  username?: string;

  @IsOptional()
  about?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;
}
