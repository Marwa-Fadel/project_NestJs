import { Controller, Post, Get, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// مفهوم ال Controllers
@Controller('appointments')
@UseInterceptors(TransformInterceptor) // مفهوم ال Interceptors
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('PATIENT') // مفهوم ال Custom Decorators (ضفنا ميتا داتا)
  @UseGuards(RolesGuard) // مفهوم ال Guards
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
  @UseGuards(RolesGuard)
  findAll() {
     return this.appointmentsService.findAll();
  }
}
