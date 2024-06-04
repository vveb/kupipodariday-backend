import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsOptional } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  link: string;

  @IsOptional()
  image: string;

  @IsOptional()
  price: number;

  @IsOptional()
  description: string;
}
