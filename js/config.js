// ====== EDIT DI SINI ======
window.CFG = {
  // teks yang muncul satu-satu setelah hitung mundur
  words: ['HAPPY', 'BIRTHDAY', 'TO', 'NAHDA', 'SHAKIRA'],
  rainLetters: 'HAPPYBIRTHDAYNAHDA',

  // Link lagu Happy Birthday (mp3 langsung). Kosongkan = pakai melodi bawaan (tanpa file).
  songUrl: '',

  // 12 foto = 6 halaman x 2 foto
  photos: Array.from({ length: 12 }, (_, i) => `images/foto-${i + 1}.jpg`),

  // teks di kotak atas buku (1 per halaman)
  notes: [
    'Happy Birthday, Nahda 🤍',
    'Makasih udah pernah jadi bagian dari cerita aku',
    'Semoga hari-harimu dipenuhi hal baik',
    'Tetap senyum ya, kamu cantik kalau lagi senyum',
    'Semoga satu per satu mimpimu jadi nyata',
    'Dari aku, dengan tulus: selamat ulang tahun 🤍'
  ],

  // pesan penutup
  message: [
    'kalau nanti aku udah gabisa ketemu kamu dan udah benar-benar gatau keadaan kamu lagi,',
    'aku selalu berharap aku pengen kamu ngelanjutin hidup kamu sebahagia mungkin sama pilihan kamu. hiduplah lebih lama dan lebih baik lagi di dunia ini.',
    'Kalau dunia lagi ga baik-baik aja sama kamu,',
    'maka kamu harus baik ke diri kamu sendiri yaaa..., jangan ngelukain diri sndiri ketika lagi banyak masalah, sering sering cerita sama orang terpercaya kamu, jangan semua apa apa di pendam, okei!!'
  ]
};
