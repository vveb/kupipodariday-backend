import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  findAll() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  create(
    createWishlistDto: CreateWishlistDto,
    items: Wish[],
    owner: User,
  ): Promise<Wishlist> {
    return this.wishlistRepository.save({
      ...createWishlistDto,
      items,
      owner,
    });
  }

  async findAllWishlists(): Promise<Wishlist[]> {
    const wishlists = await this.findAll();
    if (wishlists.length == 0) {
      throw new NotFoundException('Списки желаний не найдены');
    }
    return wishlists;
  }

  async createNewWishlist(createWishlistDto: CreateWishlistDto, user: User) {
    const wishes = [];
    const { itemsId } = createWishlistDto;
    await itemsId.forEach(async (wishId) => {
      const wish = await this.wishesService.findWishById(wishId);
      wishes.push(wish);
    });
    delete createWishlistDto.itemsId;
    return await this.create(createWishlistDto, wishes, user);
  }
}
