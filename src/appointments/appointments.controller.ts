import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserRole } from '../common/decorators/current-user-role.decorator';

// مفهوم ال Controllers
@Controller('appointments')
@UseInterceptors(TransformInterceptor) // مفهوم ال Interceptors
@UseGuards(JwtAuthGuard, RolesGuard) // مفهوم ال Guards - كل الـ routes هون محتاجة تسجيل دخول
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('PATIENT') // مفهوم ال Custom Decorators (ضفنا ميتا داتا)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() patientId: number, //مفهوم ال Custom Decorators
  ) {
    const { doctorId, startTime, endTime } = createAppointmentDto;
    return this.appointmentsService.create(
      doctorId,
      patientId,
      new Date(startTime),
      new Date(endTime),
    );
  }

  @Get()
  @Roles('ADMIN')
  findAll(@Query('patientId') patientId?: string) {
    return this.appointmentsService.findAll(patientId ? Number(patientId) : undefined);
  }

  @Get('mine')
  @Roles('PATIENT')
  findMine(@CurrentUser() patientId: number) {
    return this.appointmentsService.findAll(patientId);
  }

  @Get(':id')
  @Roles('ADMIN', 'PATIENT')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() userId: number,
    @CurrentUserRole() role: string,
  ) {
    return this.appointmentsService.findOne(id, userId, role);
  }

  @Patch(':id/cancel')
  @Roles('PATIENT', 'ADMIN')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() userId: number,
    @CurrentUserRole() role: string,
  ) {
    return this.appointmentsService.cancel(id, userId, role);
  }
}
