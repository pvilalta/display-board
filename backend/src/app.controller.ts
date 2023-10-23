import { Controller, Delete, Param, Body, Post, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { BodyPlanDto, ResponseDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getMessages')
  getMessages(): Promise<ResponseDto> {
    return this.appService.getMessages();
  }

  @Post('/plan')
  planMessage(@Body() body: BodyPlanDto): Promise<ResponseDto> {
    return this.appService.planMessage(body);
  }

  @Delete('/plan/:displayId/:id')
  deletePlan(
    @Param('id') id: string,
    @Param('displayId') displayId: string,
  ): Promise<ResponseDto> {
    return this.appService.deletePlan({ id, displayId });
  }
}
