import { Controller, Get, Post, Body, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

// Controllers
@Controller('doctors')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // أي مستخدم مسجّل دخول (PATIENT أو ADMIN) يقدر يتصفح الأطباء
  @Get()
  findAll(@Query('specialty') specialty?: string) {
    return this.doctorsService.findAll(specialty);
  }

  // بس الـ ADMIN يقدر يضيف دكتور جديد
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }
}
