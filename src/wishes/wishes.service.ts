import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';

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
      relations: ['owner'],
    });
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
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async deleteWishById(id: number) {
    const wish = await this.findWishById(id);
    return this.wishesRepository.delete(wish.id);
  }
}
