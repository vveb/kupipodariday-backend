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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWish(@Param('id') id: number) {
    return this.wishesService.deleteWishById(id);
  }
}
