import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UserIsAuthenticated } from '@/common/decorators/userIsAuthenticated.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateFlowEventDto } from './dto/create-flow-event.dto';
import { UpdateFlowEventDto } from './dto/update-flow-event.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { setWhatsappsDto } from './dto/set-whatsapps.dto';
import { ProductEntity } from './entities/product.entity';
import { RemoveWhatsappDto } from './dto/remove-whatsapp.dto';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UserIsAuthenticated()
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Get()
  @UserIsAuthenticated()
  findAll(@Req() req: any) {
    return this.productService.findAllProducts(req.user.id);
  }

  @Get(':id')
  @UserIsAuthenticated()
  @ApiOkResponse({
    type: ProductEntity,
  })
  findOne(@Req() req: any, @Param('id') id: string): Promise<ProductEntity> {
    return this.productService.findProduct(id, req.user.id);
  }

  @Patch(':id')
  @UserIsAuthenticated()
  update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    return this.productService.updateProduct(id, createProductDto, req.user.id);
  }

  @Delete(':id')
  @UserIsAuthenticated()
  delete(@Req() req: any, @Param('id') id: string) {
    return this.productService.deleteProduct(id, req.user.id);
  }

  //FLOW EVENT

  @Post('flow-event')
  @UserIsAuthenticated()
  createFlowEvent(@Body() body: CreateFlowEventDto, @Req() req: any) {
    return this.productService.createFlowEvent(body, req.user.id);
  }

  @Post('flow-event/upload-file/:product_id')
  @UserIsAuthenticated()
  createMediaUploadUrl(
    @Param('product_id') product_id: string,
    @Req() req: any,
  ) {
    return this.productService.createUploadUrl(product_id, req.user.id);
  }

  @Post('flow-event/download-file/:product_id/:file_id')
  @UserIsAuthenticated()
  createMediaDownloadUrl(
    @Param('product_id') product_id: string,
    @Param('file_id') file_id: string,
    @Req() req: any,
  ) {
    return this.productService.createDownloadUrl(
      `${req.user.id}/${product_id}/${file_id}`,
    );
  }

  @Patch('flow-event/:id')
  @UserIsAuthenticated()
  updateFlowEvent(
    @Param('id') id: string,
    @Body() body: UpdateFlowEventDto,
    @Req() req: any,
  ) {
    return this.productService.updateFlowEvent(id, body, req.user.id);
  }

  @Delete('flow-event/:id')
  @UserIsAuthenticated()
  deleteFlowEvent(@Req() req: any, @Param('id') id: string) {
    return this.productService.deleteFlowEvent(id, req.user.id);
  }

  //WHATSAPP

  @Post(':id/whatsapp')
  @UserIsAuthenticated()
  @ApiBody({
    type: setWhatsappsDto,
  })
  setWhatsapp(
    @Param('id') productId: string,
    @Body() body: setWhatsappsDto,
    @Req() req: any,
  ) {
    return this.productService.setWhatsapps(
      productId,
      req.user.id,
      body.whatsappId,
    );
  }

  @Delete(':id/whatsapp')
  @UserIsAuthenticated()
  @ApiBody({
    type: setWhatsappsDto,
  })
  removeWhatsappFromProduct(
    @Param('id') productId: string,
    @Body() body: RemoveWhatsappDto,
    @Req() req: any,
  ) {
    return this.productService.removeWhatsappFromProduct(
      productId,
      req.user.id,
      body.whatsappId,
    );
  }

  //WEBHOOK
  @Post('webhook/:id')
  @ApiBody({
    type: Object,
  })
  webhook(@Param('id') id: string, @Req() req: any) {
    return this.productService.webhook(id, req.body);
  }
}
