import {
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
      throw new NotFoundException(
        'Такого желания у нас нет :( Но вы можете его создать! ;)',
      );
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Это не ваше желание, так что и менять его нельзя',
      );
    }
    if (updateWishDto.price && wish?.offers.length > 0) {
      throw new ForbiddenException(
        'Это желание поменять не получится, так как кто-то уже решил его поддержать',
      );
    }
    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async deleteWishById(id: number) {
    const wish = await this.findWishById(id);
    return this.wishesRepository.delete(wish.id);
  }
}
