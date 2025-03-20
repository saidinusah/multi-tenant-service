import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

type ValidationErrorResult = {
  message: string;
  errors: Array<{ field: string; errors: Array<string> }>;
};

@Injectable()
export class AppValidationPipe implements PipeTransform {
  validationErrors: ValidationErrorResult = {
    message: "The given data was invalid",
    errors: [],
  };
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const requestErrors = await validate(object);
    if (requestErrors?.length) {
      this.validationErrors.errors = [];
      this.formatFormErrors(requestErrors);
      const { errors, message } = this.validationErrors;

      throw new UnprocessableEntityException({
        errors: errors,
        message,
      });
    }
    return value;
  }

  private formatFormErrors(formErrors: Array<ValidationError>, parent = "") {
    formErrors.forEach((item) => {
      const field = parent ? `${parent}.${item.property}` : item.property;
      const errors: Array<string> = [];
      const children = item.children;

      for (const key in item.constraints) {
        errors.push(item.constraints[key]);
      }

      if (children?.length) {
        this.formatFormErrors(children, field);
      }
      if (errors?.length) {
        this.validationErrors.errors.push({ field, errors });
      }
    });
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
