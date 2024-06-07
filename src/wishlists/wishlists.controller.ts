import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.findAllWishlists();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createNewWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ): Promise<Wishlist> {
    return this.wishlistsService.createNewWishlist(createWishlistDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getWishlistById(@Param('id') id: number) {
    return this.wishlistsService.findWishlistById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateWishlistById(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.updateWishlistById(
      id,
      updateWishlistDto,
      user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWishlistById(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.deleteWishlistById(id, user);
  }
}
