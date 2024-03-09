import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';
import CreateUserDto from '../user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Rota para criar um novo usuário' })
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Rota para realizar o login' })
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req: any, @Body() b: LoginUserDto) {
    return this.authService.login(req.user);
  }
}
