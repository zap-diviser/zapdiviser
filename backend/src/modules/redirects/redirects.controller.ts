import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Redirect,
  Logger,
} from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { UpdateRedirectDto } from './dto/update-redirect.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserIsAuthenticated } from '@/common/decorators/userIsAuthenticated.decorator';
import { CreateRedirectLinkDto } from './dto/create-redirect-link.dto';
import { UpdateRedirectLinkDto } from './dto/update-redirect-link.dto';
import { RedirectEntity } from './entities/redirect.entity';

@Controller('redirects')
@ApiTags('Redirects')
export class RedirectsController {
  private readonly logger = new Logger(RedirectsController.name);

  constructor(private readonly redirectsService: RedirectsService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Executar o redirect' })
  @Redirect()
  async redirect(@Param('slug') slug: string) {
    let url = await this.redirectsService.redirect(slug);
    this.logger.log(url);

    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    return {
      url,
    };
  }

  @Post()
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Criar redirect' })
  create(@Body() createRedirectDto: CreateRedirectDto, @Req() req: any) {
    return this.redirectsService.create(createRedirectDto, req.user.id);
  }

  @Post(':id/link')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Adicionar um link a um redirect' })
  createLink(
    @Param('id') id: string,
    @Body() createRedirectLinkDto: CreateRedirectLinkDto,
    @Req() req: any,
  ) {
    return this.redirectsService.createRedirectLink(
      id,
      createRedirectLinkDto,
      req.user.id,
    );
  }

  @Get()
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Listar todos os redirects do usuário' })
  findAll(@Req() req: any): Promise<RedirectEntity[]> {
    return this.redirectsService.findAll(req.user.id);
  }

  @Get('slug-available/:slug')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Verificar se um slug está disponível' })
  async slugAvailable(@Param('slug') slug: string) {
    return {
      available: await this.redirectsService.slugAvailable(slug),
    };
  }

  @Get(':id')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Obter todos os dados de um redirect' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.redirectsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Modificar um redirect' })
  update(
    @Param('id') id: string,
    @Body() updateRedirectDto: UpdateRedirectDto,
    @Req() req: any,
  ) {
    return this.redirectsService.update(id, updateRedirectDto, req.user.id);
  }

  @Patch(':id/link/:linkId')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Modificar um link de um redirect' })
  updateLink(
    @Param('id') id: string,
    @Param('linkId') linkId: string,
    @Body() updateRedirectLinkDto: UpdateRedirectLinkDto,
    @Req() req: any,
  ) {
    return this.redirectsService.updateRedirectLink(
      id,
      linkId,
      updateRedirectLinkDto,
      req.user.id,
    );
  }

  @Delete('link/:linkId')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Remover um link de um redirect' })
  async removeLink(@Param('linkId') linkId: string, @Req() req: any) {
    return this.redirectsService.removeRedirectLink(linkId, req.user.id);
  }

  @Delete(':id')
  @UserIsAuthenticated()
  @ApiOperation({ summary: 'Remover um redirect' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.redirectsService.remove(id, req.user.id);
  }
}
