# Medical Appointments System - NestJS

نظام طبي يحاكي حجز المواعيد باستخدام nestJs

البيانات مخزنة بقاعدة بيانات حقيقية (SQLite) عبر Prisma ORM 7

## المتطلبات:
- Node.js 20.19.0 أو أحدث 

## كيفية التشغيل:
1. `npm install`
2. `npx prisma migrate deploy`
3. `npx prisma db seed`
4. `npm run start:dev`

## المفاهيم المطبقة:
1. First Steps: main.ts setup
2. Modules: AppModule, AppointmentsModule
3. Providers: AppointmentsService
4. Controllers: AppointmentsController
5. Custom Decorators: @Roles(), @CurrentUser()
6. Guards: RolesGuard
7. Pipes: ValidationPipe (DTOs)
8. Middleware: LoggerMiddleware
9. Exception Filters: HttpExceptionFilter
10. Interceptors: TransformInterceptor
11. Database (Prisma ORM 7): PrismaService + driver adapter (@prisma/adapter-better-sqlite3) - Doctor & Appointment tables with migrations and seed data

## اختبار الـ API (POST /appointments):
لإنشاء موعد ناجح كـ مريض:
Headers:
  user-role: PATIENT
  user-id: 5
Body:
{
  "doctorId": 1,
  "startTime": "2026-10-01T10:00:00",
  "endTime": "2026-10-01T10:30:00"
}
