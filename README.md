# Medical Appointments System - NestJS

نظام طبي يحاكي حجز المواعيد باستخدام nestJs

البيانات مخزنة في الذاكرة (In-Memory)

## كيفية التشغيل:
1. `npm install`
2. `npm run start:dev`

## المفاهيم المطبقة:
1. First Steps: main.ts setup
2. Modules: AppModule, AppointmentsModule
3. Providers: AppointmentsService
4. Controllers: AppointmentsController
5. Custom Decorators: @Roles()
6. Guards: RolesGuard
7. Pipes: ValidationPipe (DTOs)
8. Middleware: LoggerMiddleware
9. Exception Filters: HttpExceptionFilter
10. Interceptors: TransformInterceptor

## اختبار الـ API (POST /appointments):
لإنشاء موعد ناجح كـ مريض:
Headers:
  user-role: PATIENT
Body:
{
  "doctorId": 1,
  "startTime": "2026-10-01T10:00:00Z",
  "endTime": "2026-10-01T10:30:00Z"
}
