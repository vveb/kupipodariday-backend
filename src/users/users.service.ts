import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return bcrypt.hash(createUserDto.password, 10).then((hash) =>
      this.userRepository.save({
        ...createUserDto,
        password: hash,
      }),
    );
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findUserByUsername(username: string): Promise<User> {
  //   return this.userRepository
  //     .findOne({
  //       where: {
  //         username: username,
  //       },
  //     })
  //     .then((res) => res)
  //     .catch((err) => {
  //       throw new Error(err.message);
  //     });
  // }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
