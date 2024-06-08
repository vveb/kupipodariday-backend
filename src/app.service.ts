import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Это бекэнд для проекта КупиПодариДай, а ты чего ожидал(а)?';
  }
}
