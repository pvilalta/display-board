import {
  IsString,
  IsNumber,
  IsNotEmpty,
  registerDecorator,
} from 'class-validator';

import { Message } from './app.entity';

function IsTimeFormat() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(value)
          );
        },
        defaultMessage() {
          return 'Text ($value) is not a valid time format!';
        },
      },
    });
  };
}

export class BodyPlanDto {
  @IsTimeFormat()
  startDate: string;

  @IsTimeFormat()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  displayId: string;
}

class timingDto {
  startDate: string;
  endDate: string;
}

export class MessageDto {
  @IsTimeFormat()
  startDate: string;

  @IsTimeFormat()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  displayId: string;

  timing: timingDto;
}

export class ResponseDto {
  @IsNumber()
  status: number;

  data: Message | string;
}
