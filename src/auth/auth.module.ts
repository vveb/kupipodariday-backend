import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { JwtConfigFactory } from '../config/jwt-config.factory';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigFactory, //импортировать
    }),
  ],
  controllers: [AuthController], //импортировать
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigFactory],
  exports: [AuthService],
})
export class AuthModule {}
