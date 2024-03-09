import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import CreateUserDto from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const adminCodes = {
  codes: [],
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserEntity> | null> {
    const user = await this.userService.getUserWithPasswordByEmail(email);

    if (!user) {
      throw new HttpException(
        'Usuário ou senha inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordIsEqual = await bcrypt.compare(password, user.password);

    if (user && passwordIsEqual) {
      const outUser: Partial<UserEntity> = user;
      delete outUser.password;
      return outUser;
    }

    return null;
  }

  async login(
    user: UserEntity & {
      access_token: string;
    },
  ) {
    const payload = { sub: user.id, level: user.level };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '10d',
    });

    const userData = await this.userService.findOne(user.id);

    return {
      access_token,
      ...userData,
    };
  }

  async register(user: CreateUserDto): Promise<
    UserEntity & {
      access_token: string;
    }
  > {
    const userNameOrEmailExists =
      await this.userService.getUserWithPasswordByEmail(user.costumer.email);

    if (userNameOrEmailExists) {
      if (userNameOrEmailExists.email === user.costumer.email) {
        throw new HttpException(
          'Este email já está cadastrado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const data = await this.userService.create({
      ...user,
      level: 'user',
    });

    const user_login = await this.login(data);
    return user_login as any;
  }

  async verifyJwt(token: string) {
    const decodedToken = await this.jwtService.verify(token);
    return decodedToken;
  }
}
