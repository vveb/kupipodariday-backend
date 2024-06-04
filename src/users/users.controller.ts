import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@AuthUser() user: User): Promise<User> {
    return this.usersService.findCurrentUser(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateCurrentUser(user.id, updateUserDto);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  getCurrentUserWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.findCurrentUserWishes(user.id);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  getWishesByUsername(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findWishesByUsername(username);
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  findManyUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
