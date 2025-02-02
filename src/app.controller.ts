import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { User } from './users/entities/users.entity';
import { HashService } from './helper/hash.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const _user = this.usersService.findOne('16404247');
    if (_user) {
      _user.then((user) => {
        if (user.password === '123') {
          const hash = new HashService(this.configService);
          user.password = hash.hashPassword('123');
          this.usersService.update(user);
        }
      });
      return;
    }
    const user = new User();
    user.phone_number = '16404247';
    user.password = '123';
    this.usersService.create(user);
  }
}
