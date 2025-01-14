import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

@Injectable()
export class AppValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const requestErrors = await validate(object);
    console.log({ object, requestErrors });
    if (requestErrors?.length > 0) {
      const mappedErrors = requestErrors?.map((item: ValidationError) => {
        const fieldErrors = [];
        for (const constraint in item.constraints) {
          // console.log({ constraint });
          // if(item.children?.length > 0 ){
          //   item.children?.map((child)=>{
          //     child.
          //   })
          // }
          fieldErrors.push(item.constraints[constraint]);
        }

        return {
          ...item,
          field: item.property,
          errors: fieldErrors,
        };
      });
      throw new UnprocessableEntityException({
        errors: mappedErrors,
        message: "Request validation failed",
      });
    }
    return value;
  }

  public toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
