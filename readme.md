# Game Bar Backend

Game Bar adalah backend sistem untuk platform ulasan game. Dibangun dengan Node.js, Express, dan MySQL, sistem ini memungkinkan pengguna untuk:

- Melihat daftar game beserta rating rata-rata dan jumlah rating.
- Melihat detail game (deskripsi, gambar, genre, developer/publisher, review).
- Register/login menggunakan JWT Authentication.
- Menulis satu review per game, memberi rating dan komentar.
- Memberi balasan ke review orang lain.
- Menyukai (like) atau tidak menyukai (dislike) review dan balasan.

## Fitur

- ✅ Autentikasi dengan JWT (Login, Register, Refresh Token)
- ✅ Role `admin` hanya bisa mengupload game
- ✅ Upload gambar ke Cloudinary (profil & galeri)
- ✅ Manajemen genre dinamis
- ✅ Sistem review dan reply
- ✅ Sistem like/dislike untuk review & reply
- ✅ Rating kumulatif & jumlah rater
- ✅ Detail game lengkap termasuk gambar, genre, dan review

## Teknologi

- Node.js
- Express.js
- MySQL (mysql2)
- JWT (jsonwebtoken)
- Bcrypt
- Cloudinary
- Multer
- dotenv
