# SELEKSI 3 LABORATORIUM PROGRAMMING
## Monolith Website with REST API

Julian Caleb Simandjuntak <br />
13522099

---

### Deskripsi Program
Program yang dibuat adalah sebuah monolith website penyedia berbagai film. Pengguna dapat melakukan login atau register sebuah akun yang dapat digunakan untuk melihat-lihat, membeli, dan menonton film. Program juga memiliki REST API yang dapat digunakan oleh FE Admin pada https://labpro-fe.hmif.dev/.

### Cara Menjalankan
Program dapat dijalankan dengan memanfaatkan Docker.
1. Buat file .env yang terdiri atas DATABASE_URL, JWT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION, dan AWS_S3_BUCKET_NAME.
2. Terdapat 4 container yang akan dijalankan pada Docker, yaitu film_catalogue_postgres (container tempat database dijalankan), film_catalogue_migration (container untuk menjalankan prisma migrate), film_catalogue_seeder (container untuk melakukan seeding), dan film_catalogue_backend (container tempat backend dan frontend dijalankan).
3. Jika menyalakan pertama kali, dapat lakukan:
```
docker-compose up --build migration seeder
```
Untuk menyalakan container database, melakukan migration, dan seeding.
4. Selanjutnya, untuk menyalakan container backend, lakukan:
```
docker-compose up --build backend
```
Untuk menyalakan container yang menyediakan frontend dan backend.
5. Buka webpage di localhost:3000/home-page, localhost:3000/login-page, atau localhost:3000/register-page.

### Design Pattern
1. Singleton
Singleton adalah design pattern yang memastikan bahwa suatu kelas hanya memiliki satu instance dan menyediakan titik akses global ke instance tersebut. Mayoritas class pada program adalah singleton, terutama yang terdapat decorator @Injectible() seperti pada file dengan ".service.ts".
2. Decorator
Decorator adalah design pattern yang memungkinkan untuk menambahkan perilaku ke suatu objek secara dinamis, tanpa mempengaruhi kelas, misalnya dengan @UseInterceptors() yang terdapat pada create dan update film.
3. Strategy
Strategy adalah design pattern yang memungkinkan untuk menentukan sekumpulan algoritma yang dapat dipertukarkan satu sama lain, misalnya pada autentikasi, program ini menggunakan Jwt, tapi dapat ditukar dengan cara lain.

### Technology Stack
Tech stack yang digunakan dalam seleksi 3 Labpro adalah sebagai berikut:
1. Bahasa: 
2. Framework Backend + API:
3. Framework Frontend:
4. Template Engine:
5. ORM:
6. Docker:
Untuk lebih lengkap, dapat melihat package.json di folder src setelah melakukan npm install. 

### List Endpoint
Endpoint dalam seleksi 3 Labpro adalah sebagai berikut:
#### AUTH
1. POST /login: Endpoint untuk melakukan login pada FE Admin.
2. POST /register-user: Endpoint untuk membuat user berdasarkan data yang diinput user.
3. POST /login-user: Endpoint untuk melakukan login user berdasarkan username dan password.
#### USERS
4. GET /self: Endpoint untuk mengambil data pribadi di untuk FE Admin.
5. GET /self-user: Endpoint untuk mengambil data pribadi berdasarkan token.
6. GET /users: Endpoint untuk mengambil data seluruh user.
7. GET /users/{id}: Endpoint untuk mengambil data salah satu user.
8. DELETE /users/{id}: Endpoint uneuk menghapus data salah satu user.
9. POST /users/{id}/balance: Endpoint untuk mengubah balance salah satu user.
#### FILMS
10. POST /films: Endpoint untuk membuat film baru.
11. GET /films: Endpoint untuk mengambil data seluruh film.
12. GET /public-films: Endpoint untuk mengambil data seluruh film tanpa perlu login.
13. GET /films/{id}: Endpoint untuk mengambil data salah satu film.
14. PUT /films/{id}: Endpoint untuk mengubah data salah satu film.
15. DELETE /films/{id}: Endpoint untuk menghapus salah satu film.
#### RENDER
16. GET /home-page: Endpoint untuk menampilkan halaman home.
17. GET /register-page: Endpoint untuk menampilkan halaman register.
18. GET /login-page: Endpoint untuk menampilkan halaman login.
19. GET /films-page: Endpoint untuk menampilkan halaman daftar film.
20. GET /film-detail-page/{id}: Endpoint untuk menampilkan detail sebuah film.
21. GET /my-list-page: Endpoint untuk menampilkan daftar film yang sudah dibeli.
22. GET /films/watch/{id}: Endpoint untuk menampilkan film yang dapat ditonton user.
#### BUTTON
23. POST /logout-btn: Endpoint untuk melakukan logout.
24. POST /login-btn-redirect: Endpoint untuk melakukan redirect ke halaman login.
25. POST /login-btn: Endpoint untuk melakukan login.
26. POST /register-btn: Endpoint untuk melakukan register.
27. POST /back-home-btn-redirect: Endpoint untuk kembali ke home.
28. POST /buy-film-btn/{id}: Endpoint untuk membeli sebuah film.
29. POST /back-films-btn-redirect: Endpoint untuk kembali ke halaman daftar film.
30. POST /back-film-detail-btn-redirect/{id}: Endpoint untuk kembali ke halaman detail sebuah film
Untuk lebih lengkap, dapat menjalankan localhost:3000/api (setelah program dijalankan) untuk melihat dokumentasi API pada Swagger.

### Spesifikasi yang dikerjakan
#### F01 - Monolith (FE)
1. Register Page
2. Login Page
3. Browse Page
4. Film Details Page
5. My List Page
#### F02 - Monolith (BE)
1. Register
2. Login
3. Browse Film
4. Buy Film
5. Bought Film
#### F03 - REST API (BE)
1. CRUD Film
2. Auth Admin
3. RUD User
#### Bonus
1. B06 - Responsive Layout
2. B07 - Dokumentasi API
3. B11 - Ember


