import { Controller, Post, Get, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

// تطبيق لمفهوم ال Controllers
@Controller('appointments')
@UseInterceptors(TransformInterceptor) // تطبيق لمفهوم ال Interceptors
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('PATIENT') // تطبيق لمفهوم ال Custom Decorators
  @UseGuards(RolesGuard) //تطبيق لمفهوم ال Guards
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, startTime, endTime } = createAppointmentDto;
    const patientId = 1; 
    return this.appointmentsService.create(
      doctorId,
      patientId, 
      new Date(startTime),
      new Date(endTime)
    );
  }
  
  @Get()
  @Roles('ADMIN') 
  @UseGuards(RolesGuard)
  findAll() {
     return this.appointmentsService.findAll();
  }
}
