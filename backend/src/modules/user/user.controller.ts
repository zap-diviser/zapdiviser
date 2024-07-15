import { Controller, Get, Post, Body, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordWithOldPasswordDto } from './dto/update-password-with-old-password-dto';
import { UpdatePasswordWithTokenDto } from './dto/update-password-with-token-dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordWithCodeDto } from './dto/forget-password-with-code.dto';
import { UserIsAuthenticated, userIsAdmin } from '../../common/decorators/userIsAuthenticated.decorator';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { UserEntity } from './entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckCodeDto } from './dto/check-code.dto';
import CreateUserDto from './dto/create-user.dto';

@Controller('user')
@ApiTags('Usuário')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @userIsAdmin()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create({ ...createUserDto, level: "user" });
  }

  @Get()
  @UserIsAuthenticated()
  findMe(@Req() req: any): Promise<Partial<UserEntity>> {
    return this.userService.findOne(req.user.id);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Rota para gerar código de recuperação de senha' })
  createRecoveryCode(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.userService.createRecoveryCode(forgetPasswordDto);
  }

  @Post('forget-password/check-code')
  @ApiOperation({ summary: 'Rota para gerar código de recuperação de senha' })
  checkCode(@Body() forgetPasswordDto: CheckCodeDto) {
    return this.userService.checkCode(forgetPasswordDto);
  }

  @Post('forget-password/code')
  @ApiOperation({ summary: 'Rota para gerar código de recuperação de senha' })
  forgetPasswordWithCode(
    @Body()
    forgetPasswordWithCodeDto: ForgetPasswordWithCodeDto,
  ) {
    return this.userService.forgetPasswordWithCode(forgetPasswordWithCodeDto);
  }

  @ApiOperation({ summary: 'Atualizar informações do usuário' })
  @UserIsAuthenticated()
  @Patch()
  update(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Alterar senha (com senha antiga)' })
  @UserIsAuthenticated()
  @Post('change-password/old-password')
  changePassword(
    @Body() updatePasswordDto: UpdatePasswordWithOldPasswordDto,
    @Req() req: any,
  ) {
    return this.userService.changePasswordWithOldPassword(
      updatePasswordDto,
      req,
    );
  }

  @ApiOperation({ summary: 'Alterar senha (com token)' })
  @Post('change-password/token')
  changePasswordWithToken(
    @Body() updatePasswordDto: UpdatePasswordWithTokenDto,
    @Req() req: any,
  ) {
    return this.userService.changePasswordWithToken(updatePasswordDto, req);
  }
}
