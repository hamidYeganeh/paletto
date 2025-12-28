import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { Types } from "mongoose";

export function IsMongoIdArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsMongoIdArray",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) return false;
          return value.every((v) => Types.ObjectId.isValid(v));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of MongoDB ObjectIds`;
        },
      },
    });
  };
}
