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
import {
  ERR_MSG,
  defineErrMessageConflictUsers,
} from '../utils/error-messages';

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
    return this.usersRepository.findOne(query);
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const checkExistence = await this.checkUserExistence(
      createUserDto.email,
      createUserDto.username,
    );
    if (checkExistence.isExists) {
      throw new ConflictException(checkExistence.errMessage);
    }
    return this.usersRepository
      .save({
        ...createUserDto,
        password: await hashValue(createUserDto.password),
      })
      .then((newUser) => this.findCurrentUser(newUser.id));
  }

  async updateCurrentUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findCurrentUser(userId);
    const isSameEmail = user.email === updateUserDto.email;
    const isSameUsername = user.username === updateUserDto.username;
    const checkExistence = await this.checkUserExistence(
      isSameEmail ? null : updateUserDto.email,
      isSameUsername ? null : updateUserDto.username,
    );
    if (checkExistence.isExists) {
      throw new ConflictException(checkExistence.errMessage);
    }
    const password = updateUserDto.password;
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async findCurrentUser(id: number) {
    const user = await this.findOne({
      where: { id },
      select: selectOptionsUserPlusEmail,
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(ERR_MSG.USER.NOT_FOUND);
  }

  async findCurrentUserWishes(id: number) {
    const wishes = await this.findOne({
      where: { id },
      relations: relations.findCurrentUserWishes,
    }).then((user) => user.wishes);
    return wishes;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.findOne({
      where: { username },
      relations: relations.findWishesByUsername,
    });
    if (user) {
      return user.wishes;
    }
    throw new NotFoundException(ERR_MSG.USER.NOT_FOUND);
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
    throw new NotFoundException(ERR_MSG.USER.NOT_FOUND);
  }

  async findMany(query: string): Promise<User[]> {
    const res = await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
      select: selectOptionsUserPlusEmail, //Согласно описанию API здесь возвращается email
    });
    return res;
  }

  async checkUserExistence(email: string, username: string) {
    const emailExists = email ? (await this.findMany(email)).length > 0 : false;
    const usernameExists = username
      ? (await this.findMany(username)).length > 0
      : false;
    let errMessage;
    if (emailExists || usernameExists) {
      errMessage = defineErrMessageConflictUsers(emailExists, usernameExists);
    }
    return { isExists: emailExists || usernameExists, errMessage };
  }
}
