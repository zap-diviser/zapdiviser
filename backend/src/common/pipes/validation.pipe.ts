import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    //check if obrigatory fields are present in value

    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: MapErrors([], errors, undefined),
      });
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

function MapErrors(errorList: any[] = [], errors: any, father) {
  errors.forEach((error) => {
    if (error.constraints) {
      errorList.push({
        object: father,
        field: error.property,
        message: error.constraints,
      });
    }
    if (error.children) {
      MapErrors(errorList, error.children, error.property);
    }
  });

  return errorList;
}
