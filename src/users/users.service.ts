import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { hashValue } from '../utils/hash';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(createUserDto.password),
    });
    return this.usersRepository.save(user);
  }

  async updateCurrentUser(id: number, updateUserDto: UpdateUserDto) {
    const password = updateUserDto.password;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async findCurrentUser(id: number) {
    const user = await this.findOne({
      where: { id },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  async findCurrentUserWishes(id: number) {
    const user = await this.findOne({
      where: { id },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (user) {
      return user.wishes;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  async findMany(query: string): Promise<User[]> {
    const res = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    if (res.length > 0) {
      return res;
    }
    throw new NotFoundException('Пользователи не найдены');
  }
}
