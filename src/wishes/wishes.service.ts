import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsOrder, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { ERR_MSG } from '../utils/error-messages';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  findByOrder(order: FindOptionsOrder<Wish>, limit: number): Promise<Wish[]> {
    return this.wishesRepository.find({
      order,
      take: limit,
      relations: ['owner', 'offers'],
    });
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOneOrFail(query);
  }

  async findManyWishesById(wishIds: number[]) {
    const wishes = [];
    for (const id of wishIds) {
      wishes.push(await this.findWishById(id));
    }
    return wishes;
  }

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.usersService.findById(userId);
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishesRepository.save(wish);
  }

  async findLastWishes(): Promise<Wish[]> {
    return await this.findByOrder({ createdAt: 'DESC' }, 40);
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.findByOrder({ copied: 'DESC' }, 20);
  }

  async findWishById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async updateWish(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (!wish) {
      throw new NotFoundException(ERR_MSG.WISH.NOT_FOUND);
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(ERR_MSG.WISH.FORBIDDEN_CHANGE);
    }
    if (updateWishDto.price && wish.offers.length > 0) {
      throw new ForbiddenException(ERR_MSG.WISH.FORBIDDEN_RAISED);
    }
    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async deleteWishById(wishId: number, userId: number) {
    const wish = await this.findWishById(wishId);
    if (!wish) {
      throw new NotFoundException(ERR_MSG.WISH.NOT_FOUND);
    }
    if (wish.owner.id != userId) {
      throw new ForbiddenException(ERR_MSG.WISH.FORBIDDEN_DELETE);
    }
    return this.wishesRepository.delete(wishId);
  }

  async copyWish(wishId: number, user: User): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (!wish) {
      throw new NotFoundException(ERR_MSG.WISH.NOT_FOUND);
    }
    const isWishAdded = (await this.wishesRepository.findOne({
      where: {
        owner: { id: user.id },
        name: wish.name,
      },
    }))
      ? true
      : false;
    if (isWishAdded) {
      throw new ConflictException(ERR_MSG.WISH.ALREADY_COPIED);
    }
    const wishCopy: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };
    return this.create(wishCopy, user.id).then(() => {
      return this.wishesRepository.save({ ...wish, copied: wish.copied + 1 });
    });
  }

  async updateWishByRaise(id: number, amount: number) {
    return this.wishesRepository.update({ id }, { raised: amount });
  }
}
