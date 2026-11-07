// Contoh data wilayah (Provinsi > Kabupaten/Kota > Kecamatan) untuk filter Navigasi Air.
// Mengikuti prototipe Figma. Nanti diganti oleh tabel provinces, city_regencies, dan districts dari Supabase.
// Curah hujan tidak dipakai di halaman ini, jadi tidak disertakan.

export const WILAYAH_CONTOH = [
  {
    "name": "DI Yogyakarta",
    "regencies": [
      {
        "name": "Gunungkidul",
        "districts": [
          {
            "name": "Rongkop"
          },
          {
            "name": "Wonosari"
          },
          {
            "name": "Playen"
          }
        ]
      },
      {
        "name": "Bantul",
        "districts": [
          {
            "name": "Bantul"
          },
          {
            "name": "Sewon"
          }
        ]
      },
      {
        "name": "Sleman",
        "districts": [
          {
            "name": "Depok"
          },
          {
            "name": "Ngaglik"
          }
        ]
      }
    ]
  },
  {
    "name": "Jawa Timur",
    "regencies": [
      {
        "name": "Kediri",
        "districts": [
          {
            "name": "Kediri"
          },
          {
            "name": "Pare"
          }
        ]
      },
      {
        "name": "Kota Kediri",
        "districts": [
          {
            "name": "Mojoroto"
          },
          {
            "name": "Kota"
          }
        ]
      },
      {
        "name": "Malang",
        "districts": [
          {
            "name": "Kepanjen"
          },
          {
            "name": "Lawang"
          }
        ]
      }
    ]
  },
  {
    "name": "Sulawesi Tenggara",
    "regencies": [
      {
        "name": "Kota Kendari",
        "districts": [
          {
            "name": "Kendari"
          },
          {
            "name": "Mandonga"
          }
        ]
      },
      {
        "name": "Konawe",
        "districts": [
          {
            "name": "Unaaha"
          },
          {
            "name": "Wawotobi"
          }
        ]
      }
    ]
  },
  {
    "name": "Nusa Tenggara Timur",
    "regencies": [
      {
        "name": "Kupang",
        "districts": [
          {
            "name": "Kupang Tengah"
          },
          {
            "name": "Sulamu"
          }
        ]
      },
      {
        "name": "Kota Kupang",
        "districts": [
          {
            "name": "Alak"
          },
          {
            "name": "Oebobo"
          }
        ]
      }
    ]
  }
];
