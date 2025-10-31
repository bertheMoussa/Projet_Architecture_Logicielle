import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Equal, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  public async validateUser(id: number, password: string): Promise<User> {
    const user = await this.userepository.findOne({ where: { id: Equal(id) } });

    if (user && bcrypt.compare(password, user.password)) {
      console.log('Success Validation');

      return user;
    } else {
      console.log('Failed Validation');

      return undefined;
    }
  }

  public async login(user: any) {
    
    const payload = { username: user.id };
    console.log(this.jwtService.sign(payload))
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
