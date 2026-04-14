fetch("http://localhost:3000/api/employees", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "jalurMasuk": "UMUM",
    "tanggalMasuk": "2026-04-13",
    "posisi": "Helper Produksi",
    "namaLengkap": "Test User",
    "jenisKelamin": "L",
    "nik": "1234567890123456",
    "fotoKtpUrl": "https://example.com/ktp.jpg",
    "fotoKkUrl": "https://example.com/kk.jpg",
    "fotoIjazahUrl": "https://example.com/ijazah.jpg",
    "sektor": 1,
    "regu": 1,
    "noHp": "0812345678"
  })
}).then(r => r.json()).then(console.log).catch(console.error);
