"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
let AppointmentsService = class AppointmentsService {
    constructor() {
        this.appointments = [];
        this.idCounter = 1;
    }
    create(doctorId, patientId, startTime, endTime) {
        const hasConflict = this.appointments.some((app) => app.doctorId === doctorId &&
            startTime < app.endTime &&
            endTime > app.startTime);
        if (hasConflict) {
            throw new common_1.ConflictException('Doctor is already booked for this time slot.');
        }
        const newAppointment = {
            id: this.idCounter++,
            doctorId,
            patientId,
            startTime,
            endTime,
            status: 'BOOKED',
        };
        this.appointments.push(newAppointment);
        return newAppointment;
    }
    findAll() {
        return this.appointments;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)()
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map