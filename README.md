# Medical Appointments System - NestJS

نظام طبي يحاكي حجز المواعيد باستخدام nestJs

البيانات مخزنة بقاعدة بيانات حقيقية (SQLite) عبر Prisma ORM 7، مع تسجيل دخول حقيقي عبر JWT.

## المتطلبات:
- Node.js 20.19.0

## كيفية التشغيل:
1. `npm install`
2. `npx prisma migrate deploy`
3. `npx prisma db seed`
4. `npm run start:dev`

## المفاهيم المطبقة:
1. First Steps: main.ts setup
2. Modules: AppModule, AppointmentsModule, DoctorsModule, AuthModule, UsersModule, PatientsModule
3. Providers: AppointmentsService, DoctorsService, AuthService, UsersService, PatientsService
4. Controllers: AppointmentsController, DoctorsController, AuthController
5. Custom Decorators: @Roles(), @CurrentUser(), @CurrentUserRole(), @CurrentPatientId()
6. Guards: RolesGuard, JwtAuthGuard
7. Pipes: ValidationPipe (DTOs), ParseIntPipe (@Param و @Query الاختياري)
8. Middleware: LoggerMiddleware
9. Exception Filters: HttpExceptionFilter
10. Interceptors: TransformInterceptor
11. Database (Prisma ORM 7): PrismaService + libsql driver adapter - User, Patient, Doctor & Appointment tables مع migrations وrelations وseed data
12. Authentication: real JWT login via @nestjs/jwt + @nestjs/passport (register/login, Bearer token)
13. Transactions: appointment booking wrapped in prisma.$transaction لمنع race condition بالحجز المزدوج
14. Configuration: @nestjs/config مع getOrThrow لضمان فشل واضح لو ناقص متغيّر بيئة أساسي متل JWT_SECRET

## البنية: User مقابل Patient
- **User**: جدول الهوية/الدخول — email، password، role (PATIENT أو ADMIN)
- **Patient**: الملف الطبي — name، مرتبط بـ User عبر `userId` (فيه علاقة واحد لواحد)
- حساب الـ ADMIN هو User بدون Patient مرتبط فيه (الأدمن ما بيحجز مواعيد لحاله)
- الحجز، الملكية، وكل شي طبي بيشتغل على `Patient.id`، مش `User.id` — الاثنين موجودين بالـ JWT (`sub` و `patientId`) وكل واحد إله استخدامه.

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
الرد بيرجع `{ "access_token": "..." }` — لازم تحطيه بكل طلب محمي كـ:
```
Authorization: Bearer <access_token>
```

**حساب ADMIN جاهز (مزروع مسبقاً بالـ seed):**
```
email: admin@test.com
password: admin123
```
لأنو `/auth/register` بيسجّل أي حدا كـ PATIENT دايماً (ولا يجوز تسمح تسجيل ذاتي كـ ADMIN لأسباب أمان)، الطريقة الوحيدة للوصول لحساب ADMIN هي هالحساب المزروع مسبقاً. سجّلي دخول فيه لتجربة `GET /appointments` أو `POST /doctors`.

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
- استخدمت `bcryptjs` بدل `bcrypt` لتشفير كلمات السر: نفس الوظيفة بالضبط، بس بدون حاجة لكومبايلر C++ محلي.
- حجز الموعد ملفوف بـ `prisma.$transaction` عشان فحص التعارض والحجز يصيروا عملية واحدة ذرية (atomic).
- فحص تعارض المواعيد بيستثني المواعيد الملغاة (`status: { not: 'CANCELLED' }`) — موعد ملغى ما لازم يمنع حجز نفس الوقت من جديد.
- الوصول لموعد معيّن (`GET /appointments/:id`) والإلغاء محميين بفحص ملكية عبر `Patient.id` (مش `User.id`).
- `?patientId=` بـ `GET /appointments` محمي بـ `ParseIntPipe({ optional: true })`: قيمة غير رقمية ترجع 400 واضحة، مش 500 عام.
- `JWT_SECRET` عن طريق `ConfigService.getOrThrow` — لو الملف `.env` ناقصها، التطبيق بيرفض يشتغل من البداية برسالة واضحة بدل ما يتصرف بشكل غير متوقع.
- `register` مش ملفوف بـ transaction (بعكس الحجز): إنشاء الـ User وبعدها الـ Patient خطوتين متتاليتين بسيطتين، فرصة الفشل الجزئي بينهم ضئيلة جداً مقارنة بسيناريو تعارض الحجز الحقيقي، فما شفت داعي لتعقيد إضافي هون.
