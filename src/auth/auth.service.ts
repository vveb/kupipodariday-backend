import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from '../utils/hash';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });

    if (user && (await verifyHash(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    // id необходимо переименовать в sub согласно документации jwtService.signAsync
    const { username, id: sub } = user;

    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
