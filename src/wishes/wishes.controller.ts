import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createWish(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWish(@Param('id') id: number) {
    return this.wishesService.deleteWishById(id);
  }
}
