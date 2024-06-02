import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  // @Get()
  // findAll() {
  //   return this.wishesService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
  //   return this.wishesService.update(+id, updateWishDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wishesService.remove(+id);
  // }
}
