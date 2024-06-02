import { IsUrl, Length, Max } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250, {
    message: 'Название списка должно быть от 1 до 250 символов',
  })
  name: string;

  @Max(1500, {
    message: 'Описание подборки не должно превышать 1 500 символов',
  })
  description: string;

  @IsUrl()
  image: string;
}
