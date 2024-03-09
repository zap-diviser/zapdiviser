import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
