# Medical Appointments System - NestJS

نظام طبي يحاكي حجز المواعيد باستخدام nestJs

البيانات مخزنة بقاعدة بيانات حقيقية (SQLite) عبر Prisma ORM 7، مع تسجيل دخول حقيقي عبر JWT.

## المتطلبات:
- Node.js 20.19.0 أو أحدث 

## كيفية التشغيل:
1. `npm install`
2. `npx prisma migrate deploy`
3. `npx prisma db seed`
4. `npm run start:dev`

## المفاهيم المطبقة:
1. First Steps: main.ts setup
2. Modules: AppModule, AppointmentsModule, DoctorsModule, AuthModule, PatientsModule
3. Providers: AppointmentsService, DoctorsService, AuthService, PatientsService
4. Controllers: AppointmentsController, DoctorsController, AuthController
5. Custom Decorators: @Roles(), @CurrentUser(), @CurrentUserRole()
6. Guards: RolesGuard, JwtAuthGuard
7. Pipes: ValidationPipe (DTOs), ParseIntPipe (@Param)
8. Middleware: LoggerMiddleware
9. Exception Filters: HttpExceptionFilter
10. Interceptors: TransformInterceptor
11. Database (Prisma ORM 7): PrismaService + libsql driver adapter - Doctor, Patient & Appointment tables with migrations, relations and seed data
12. Authentication: real JWT login via @nestjs/jwt + @nestjs/passport (register/login, Bearer token, no more header-based simulation)
13. Transactions: appointment booking wrapped in prisma.$transaction to prevent a race condition on double-booking

## تسجيل الدخول (Auth):

**تسجيل حساب جديد:**
```
POST /auth/register
Body: { "name": "Marwa", "email": "marwa@test.com", "password": "secret123" }
```

**تسجيل الدخول:**
```
POST /auth/login
Body: { "email": "marwa@test.com", "password": "secret123" }
```


**حساب ADMIN جاهز (مزروع مسبقاً بالـ seed):**
```
email: admin@test.com
password: admin123
```

**بيانات المستخدم الحالي (بدون كلمة السر):**
```
GET /auth/me
```

## نقاط الـ API:

| Method | Route | الوصف | الصلاحية |
|---|---|---|---|
| POST | /auth/register | تسجيل حساب جديد | عام |
| POST | /auth/login | تسجيل دخول | عام |
| GET | /auth/me | بيانات المستخدم الحالي | أي مستخدم مسجّل دخول |
| GET | /doctors | عرض كل الأطباء (فلترة اختيارية `?specialty=`) | أي مستخدم مسجّل دخول |
| POST | /doctors | إضافة دكتور جديد | ADMIN |
| POST | /appointments | حجز موعد | PATIENT |
| GET | /appointments | كل المواعيد (فلترة اختيارية `?patientId=`) | ADMIN |
| GET | /appointments/mine | مواعيدي أنا (المريض الحالي) | PATIENT |
| GET | /appointments/:id | موعد واحد بالـ id | PATIENT (لموعده فقط) / ADMIN (أي موعد) |
| PATCH | /appointments/:id/cancel | إلغاء موعد | PATIENT (موعده فقط) / ADMIN (أي موعد) |

## ملاحظات على قرارات معمارية:
- استخدمت `bcryptjs` بدل `bcrypt` لتشفير كلمات السر: نفس الوظيفة بالضبط، بس بدون حاجة لكومبايلر C++ محلي (bcrypt مكتبة native بتحتاج بناء محلي، bcryptjs جافاسكريبت )
- حجز الموعد ملفوف بـ `prisma.$transaction` عشان فحص التعارض والحجز يصيروا عملية واحدة ذرية (atomic)، ما يسمحوا بحجزين متزامنين لنفس الموعد
- الوصول لموعد معيّن (`GET /appointments/:id`) والإلغاء محميين بفحص ملكية: مريض بيقدر يشوف/يلغي مواعيده هو بس، الأدمن يقدر لأي موعد
