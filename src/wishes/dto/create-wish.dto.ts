import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250, { message: 'Имя подарка должно быть от 1 до 250 символов' })
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  @Length(1, 1024, {
    message: 'Описание подарка должно быть от 1 до 1024 символов',
  })
  description: string;

}
