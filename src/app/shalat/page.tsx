'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JadwalShalat {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Sunset: string;
  };
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      month: {
        ar: string;
        en: string;
      };
      year: string;
    };
    gregorian: {
      date: string;
      day: string;
      month: {
        en: string;
      };
      year: string;
    };
  };
}

const JadwalShalatPage = () => {
  const router = useRouter();
  const [jadwal, setJadwal] = useState<JadwalShalat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lokasi, setLokasi] = useState<{ latitude: number; longitude: number } | null>(null);
  const [shalatSekarang, setShalatSekarang] = useState<string | null>(null);
  const [shalatBerikutnya, setShalatBerikutnya] = useState<string | null>(null);
  const [waktuShalatBerikutnya, setWaktuShalatBerikutnya] = useState<string | null>(null);
  const [jarakWaktu, setJarakWaktu] = useState<{ jam: number; menit: number; detik: number } | null>(null);
  const [jamSekarang, setJamSekarang] = useState<string>('');

  // Ambil lokasi pengguna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLokasi({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Tidak dapat mengambil lokasi. Silakan izinkan akses lokasi.');
        }
      );
    } else {
      setError('Browser tidak mendukung geolocation.');
    }
  }, []);

  // Ambil jadwal shalat berdasarkan lokasi
  useEffect(() => {
    if (!lokasi) return;

    const fetchJadwal = async () => {
      try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&method=2`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setJadwal(result.data);

        // Hitung shalat saat ini dan berikutnya
        hitungShalatSekarangDanBerikutnya(result.data.timings);
      } catch (error) {
        console.error('Error fetching jadwal shalat:', error);
        setError('Gagal memuat jadwal shalat. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [lokasi]);

  // Fungsi untuk menghitung shalat saat ini dan berikutnya
  const hitungShalatSekarangDanBerikutnya = (timings: { [key: string]: string }) => {
    const waktuSekarang = new Date();
    
    // Filter out Sunset and rename Sunrise to Syuruq
    const filteredTimings = Object.entries(timings)
      .filter(([nama]) => nama !== 'Sunset')
      .map(([nama, waktu]) => {
        const newName = nama === 'Sunrise' ? 'Syuruq' : nama;
        return [newName, waktu];
      });
    
    const waktuShalat = filteredTimings.map(([nama, waktu]) => {
      const [jam, menit] = waktu.split(':');
      const tanggalShalat = new Date();
      tanggalShalat.setHours(Number(jam), Number(menit), 0, 0);
      return { nama, waktu: tanggalShalat };
    });

    // Urutkan berdasarkan waktu
    waktuShalat.sort((a, b) => a.waktu.getTime() - b.waktu.getTime());

    // Cari shalat saat ini dan berikutnya
    for (let i = 0; i < waktuShalat.length; i++) {
      if (waktuSekarang < waktuShalat[i].waktu) {
        setShalatSekarang(i === 0 ? null : waktuShalat[i - 1].nama);
        setShalatBerikutnya(waktuShalat[i].nama);
        setWaktuShalatBerikutnya(waktuShalat[i].waktu.toTimeString().substring(0, 5));

        // Hitung jarak waktu antara shalat saat ini dan berikutnya
        if (i > 0) {
          const updateCountdown = () => {
            const sekarang = new Date();
            const jarak = waktuShalat[i].waktu.getTime() - sekarang.getTime();
            const jam = Math.floor(jarak / (1000 * 60 * 60));
            const menit = Math.floor((jarak % (1000 * 60 * 60)) / (1000 * 60));
            const detik = Math.floor((jarak % (1000 * 60)) / 1000);
            setJarakWaktu({ jam, menit, detik });
          };

          updateCountdown();
          const interval = setInterval(updateCountdown, 1000);
          return () => clearInterval(interval);
        } else {
          setJarakWaktu(null);
        }
        break;
      }
    }
  };

  // Update jam saat ini setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const sekarang = new Date();
      const jam = sekarang.getHours().toString().padStart(2, '0');
      const menit = sekarang.getMinutes().toString().padStart(2, '0');
      const detik = sekarang.getSeconds().toString().padStart(2, '0');
      setJamSekarang(`${jam}:${menit}:${detik}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Daftar bulan Hijriyah
  const bulanHijriyah = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sya'ban", 
    "Ramadan", "Syawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!jadwal) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-gray-700 text-lg">Tidak ada data jadwal shalat yang ditemukan</p>
      </div>
    );
  }

  // Filter out Sunset and rename Sunrise to Syuruq for display
  const filteredTimings = Object.entries(jadwal.timings)
    .filter(([nama]) => nama !== 'Sunset' && nama !== 'Midnight' && nama !== 'Firstthird' && nama !== 'Lastthird' && nama !== 'Imsak')
    .map(([nama, waktu]) => {
      const newName = nama === 'Sunrise' ? 'Syuruq' : nama;
      return [newName, waktu];
    });

  // Dapatkan bulan Gregorian dan Hijriyah saat ini
  const gregorianDate = new Date();
  const bulanGregorian = gregorianDate.toLocaleString('default', { month: 'long' });
  const bulanHijri = bulanHijriyah[parseInt(jadwal.date.hijri.month.en) - 1] || jadwal.date.hijri.month.ar;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
      {/* Container Utama */}
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-center relative">
          {/* Tombol Kembali */}
          <button 
            onClick={() => router.push('/surat')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-blue-100 rounded-full p-2 shadow-md transition-colors duration-200"
            aria-label="Kembali ke Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Jadwal Shalat
          </h1>
          <p className="text-sm text-white">
            {jadwal.date.gregorian.day}, {jadwal.date.gregorian.date} {bulanGregorian} {jadwal.date.gregorian.year}
          </p>
          <p className="text-sm text-white">
            {jadwal.date.hijri.day} {jadwal.date.hijri.date} {bulanHijri} {jadwal.date.hijri.year} H
          </p>
          <p className="text-sm text-white mt-2">
            Jam Sekarang: <span className="font-bold">{jamSekarang}</span>
          </p>
        </div>

        {/* Shalat Sekarang dan Berikutnya */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <p className="text-lg font-semibold text-blue-800 mb-2">Shalat Sekarang</p>
            <p className="text-2xl font-bold text-blue-800">
              {shalatSekarang || 'Tidak ada'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <p className="text-lg font-semibold text-purple-800 mb-2">Shalat Berikutnya</p>
            <p className="text-2xl font-bold text-purple-800 mb-1">
              {shalatBerikutnya || 'Tidak ada'}
            </p>
            {waktuShalatBerikutnya && (
              <p className="text-sm text-gray-600">
                Pukul: <span className="font-bold">{waktuShalatBerikutnya}</span>
              </p>
            )}
            {jarakWaktu && (
              <p className="text-sm text-gray-600 mt-2">
                Dalam: <span className="font-bold">
                  {jarakWaktu.jam > 0 ? `${jarakWaktu.jam} jam ` : ''}
                  {jarakWaktu.menit > 0 ? `${jarakWaktu.menit} menit ` : ''}
                  {jarakWaktu.detik} detik
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Daftar Jadwal Shalat */}
        <div className="space-y-4">
          {filteredTimings.map(([nama, waktu]) => (
            <div
              key={nama}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">{nama}</span>
                </div>
                <span className="text-lg font-bold text-gray-800">{waktu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalShalatPage;