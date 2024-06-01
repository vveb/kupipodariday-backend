import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {
    const databaseURL = this.configService.get<string>('DATABASE_URL');
    const databasePort = this.configService.get<string>('DATABASE_PORT');
    const databaseName = this.configService.get<string>('DATABASE_NAME');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
