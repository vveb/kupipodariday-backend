import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ERR_MSG } from '../utils/error-messages';

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

  findById(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
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

  update(
    wishlist: Wishlist,
    updateWishlistDto: UpdateWishlistDto,
    items: Wish[],
  ) {
    const { name, description, image } = updateWishlistDto;
    return this.wishlistRepository.save({
      id: wishlist.id,
      name: name ? name : wishlist.name,
      description: description ? description : wishlist.description,
      image: image ? image : wishlist.image,
      items: items ? items : wishlist.items,
      owner: wishlist.owner,
    });
  }

  async findAllWishlists(): Promise<Wishlist[]> {
    const wishlists = await this.findAll();
    if (wishlists.length == 0) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND_MANY);
    }
    return wishlists;
  }

  async createNewWishlist(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId } = createWishlistDto;
    const wishes = await this.wishesService.findManyWishesById(itemsId);
    if (wishes?.length === 0) {
      throw new BadRequestException(ERR_MSG.WISHLIST.NOT_EMPTY);
    }
    delete createWishlistDto.itemsId;
    return await this.create(createWishlistDto, wishes, user);
  }

  async findWishlistById(id: number) {
    const wishlist = await this.findById(id);
    if (!wishlist) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND_ONE);
    }
    return wishlist;
  }

  async updateWishlistById(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ) {
    const wishlist = await this.findById(id);
    if (!wishlist) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND_ONE);
    }
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(ERR_MSG.WISHLIST.FORBIDDEN_CHANGE);
    }
    let wishes;
    const { itemsId } = updateWishlistDto;
    if (itemsId) {
      wishes = await this.wishesService.findManyWishesById(itemsId);
    }
    return this.update(wishlist, updateWishlistDto, wishes);
  }

  async deleteWishlistById(id: number, user: User) {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND_ONE);
    }
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(ERR_MSG.WISHLIST.FORBIDDEN_DELETE);
    }
    return this.wishlistRepository.delete(id);
  }
}
