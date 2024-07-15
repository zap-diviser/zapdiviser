import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';

//check if user is authenticated based on jwt token

export const UserIsAuthenticated = () => {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
};

export const userIsAdmin = () => {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}

