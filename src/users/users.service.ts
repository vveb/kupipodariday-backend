import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from '../utils/hash';
import { Wish } from '../wishes/entities/wish.entity';
import { selectOptionsUserPlusEmail } from '../utils/select-options';
import relations from '../utils/relations';
import { defineErrMessageConflictUsers } from '../utils/error-messages';

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
    const check = await this.checkUserExistence(
      createUserDto.email,
      createUserDto.username,
    );
    if (check.isExists) {
      throw new ConflictException(check.errMessage);
    }
    return this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(createUserDto.password),
    });
  }

  async updateCurrentUser(id: number, updateUserDto: UpdateUserDto) {
    const password = updateUserDto.password;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository
      .save({ ...user, ...updateUserDto })
      .then(() => this.findCurrentUser(id));
  }

  async findCurrentUser(id: number) {
    const user = await this.findOne({
      where: { id },
      select: selectOptionsUserPlusEmail,
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  async findCurrentUserWishes(id: number) {
    const wishes = await this.findOne({
      where: { id },
      relations: relations.findCurrentUserWishes,
    }).then((user) => user.wishes);
    return wishes;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: relations.findWishesByUsername,
    });
    if (user) {
      return user.wishes;
    }
    throw new NotFoundException('Пользователь не найден');
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({
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
      where: [{ email: query }, { username: query }],
      select: selectOptionsUserPlusEmail, //Согласно описанию API здесь возвращается email
    });
    return res;
  }

  async checkUserExistence(email: string, username: string) {
    const emailExists = (await this.findMany(email)).length > 0;
    const usernameExists = (await this.findMany(username)).length > 0;
    let errMessage;
    if (emailExists || usernameExists) {
      errMessage = defineErrMessageConflictUsers(emailExists, usernameExists);
    }
    return { isExists: emailExists || usernameExists, errMessage };
  }
}
