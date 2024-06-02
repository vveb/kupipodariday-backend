import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.usersService.findById(userId);
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishesRepository.save(wish);
  }

  async findWishById(id: number) {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async deleteWishById(id: number) {
    return await this.wishesRepository.delete(id);
  }

  // findAll() {
  //   return `This action returns all wishes`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} wish`;
  // }

  // update(id: number, updateWishDto: UpdateWishDto) {
  //   return `This action updates a #${id} wish`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} wish`;
  // }
}
