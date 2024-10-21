import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Info')
@Controller('info')
export class InfoController {
  @Get()
  async getInfo() {
    return {
      data: {
        fullName: 'Đinh Quốc Chương',
        studentCode: 'QE170097',
      },
    };
  }
}
