import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordWithCodeDto } from './dto/forget-password-with-code.dto';
import { UpdatePasswordWithOldPasswordDto } from './dto/update-password-with-old-password-dto';
import { UpdatePasswordWithTokenDto } from './dto/update-password-with-token-dto';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CheckCodeDto } from './dto/check-code.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    const users = await this.repository.find();

    return users.map((user) => this.removePrivateFields(user));
  }

  async findOne(id: string): Promise<Partial<UserEntity>> {
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    delete (user as Partial<UserEntity>).password;

    return user;
  }

  async update(id: string, updateUserDto: Partial<UserEntity>) {
    const user = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    this.repository.merge(user, updateUserDto);

    await this.repository.save(user);

    return this.removePrivateFields(user);
  }

  async getById(id: string) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        whatsapps: true,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async changePasswordWithOldPassword(
    updatePasswordWithOldPasswordDto: UpdatePasswordWithOldPasswordDto,
    req: any,
  ) {
    let user = await this.repository.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const passwordIsEqual = await bcrypt.compare(
      updatePasswordWithOldPasswordDto.old_password,
      user.password,
    );

    if (!passwordIsEqual) {
      throw new HttpException(
        'Senha ou token inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    user = this.repository.merge(user, {
      password: await bcrypt.hash(
        updatePasswordWithOldPasswordDto.new_password,
        10,
      ),
    });

    await this.repository.save(user);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async changePasswordWithToken(
    updatePasswordWithTokenDto: UpdatePasswordWithTokenDto,
    req: any,
  ) {
    let user = await this.repository.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const { email, type } = this.jwtService.verify<{
      email: string;
      type: string;
    }>(updatePasswordWithTokenDto.token);

    const passwordIsEqual = email === user.email && type === 'change-password';

    if (!passwordIsEqual) {
      throw new HttpException(
        'Senha ou token inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    user = this.repository.merge(user, {
      password: await bcrypt.hash(updatePasswordWithTokenDto.new_password, 10),
    });

    await this.repository.save(user);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async getUserWithPasswordByEmail(email: string) {
    const user = await this.repository.findOne({
      where: {
        email,
      },
      select: [
        'id',
        'email',
        'password',
        'level',
        'is_active',
        'name',
        'deleted_at',
        'created_at',
      ],
    });

    return user;
  }

  async createRecoveryCode(forgetPasswordDto: ForgetPasswordDto) {
    const userFinded = await this.repository.findOne({
      where: [{ email: forgetPasswordDto.email }],
    });

    if (!userFinded) {
      throw new HttpException('Email não encontrado', HttpStatus.BAD_REQUEST);
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await this.emailService.send({
      to: userFinded.email,
      email_template: 'forget-password',
      params: {
        code,
      },
      email_subject: 'Seu código de recuperação de senha',
    });

    const key = `recovery-code-${forgetPasswordDto.email}`;

    const object = JSON.stringify({
      code,
      try: 0,
    });

    await this.redisService.getClient().set(key, object, 'EX', 60 * 15);

    return {
      message: 'Código de recuperação enviado com sucesso!',
    };
  }

  async forgetPasswordWithCode(
    forgetPasswordWithCode: ForgetPasswordWithCodeDto,
  ) {
    const key = `recovery-code-${forgetPasswordWithCode.email}`;

    const data = await this.redisService.getClient().get(key);

    if (!data) {
      throw new HttpException(
        'Código de recuperação não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { code, try: tryCount } = JSON.parse(data);

    if (tryCount >= 3) {
      throw new HttpException(
        'Limite de tentativas excedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (String(code) !== String(forgetPasswordWithCode.code)) {
      await this.redisService
        .getClient()
        .set(key, JSON.stringify({ code, try: tryCount + 1 }), 'EX', 60 * 15);

      throw new HttpException(
        'Código de recuperação inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.repository.findOne({
      where: { email: forgetPasswordWithCode.email },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    this.repository.merge(user, {
      password: await bcrypt.hash(forgetPasswordWithCode.newPassword, 10),
    });

    await this.repository.save(user);

    await this.redisService.getClient().del(key);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async checkCode(forgetPasswordWithCode: CheckCodeDto) {
    const key = `recovery-code-${forgetPasswordWithCode.email}`;

    const data = await this.redisService.getClient().get(key);

    if (!data) {
      throw new HttpException(
        'Código de recuperação não encontrado, solicite um novo código',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { code, try: tryCount } = JSON.parse(data);

    if (tryCount >= 5) {
      throw new HttpException(
        'Limite de tentativas excedido, solicite um novo código',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (String(code) !== String(forgetPasswordWithCode.code)) {
      await this.redisService
        .getClient()
        .set(key, JSON.stringify({ code, try: tryCount + 1 }), 'EX', 60 * 15);

      throw new HttpException(
        'Código de recuperação inválido, tentativas restantes: ' +
          (4 - tryCount),

        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  async create(
    createUserDto: CreateUserDto & {
      level: 'admin' | 'user';
    },
  ) {
    const user = this.repository.create({
      ...createUserDto,
      is_active: true,
    });

    const data = await this.repository.save(user);

    return this.removePrivateFields(data);
  }

  private removePrivateFields(user: any) {
    user.password = undefined;
    user.createdAt = undefined;

    return user;
  }

  async getByInstanceId(instanceId: string) {
    return this.repository.findOneOrFail({
      where: {
        whatsapps: {
          id: instanceId,
        },
      },
    });
  }
}
