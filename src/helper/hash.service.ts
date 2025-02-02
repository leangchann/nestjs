import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Global()
@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  salt = parseInt(this.configService.getOrThrow('BCRYPT_SALT'));

  public hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.salt);
  }

  public comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
