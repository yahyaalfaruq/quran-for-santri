'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProgressPage = () => {
  const [progress, setProgress] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    review: false,
  });

  const router = useRouter();

  const handleCheckboxChange = (day) => {
    console.log("Hari adalah ", day);
    setProgress((prev) => {
      localStorage.setItem("days", JSON.stringify({
        ...prev,
        [day]: !prev[day],
      }))
      return {
        ...prev,
        [day]: !prev[day],
      }
    });
  };

  useEffect(() => {
    const days = localStorage.getItem("days");
    if (days) {
      try {
        const parsed = JSON.parse(days);
        if (parsed && typeof parsed === "object") {
          setProgress((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // ignore invalid json
      }
    }
  }, []);

  const handleSave = () => {
    // Simpan progres (misalnya ke localStorage atau backend API)
    console.log('Progres disimpan:', progress);
    alert('Progres berhasil disimpan!');
    router.push('/');  // Kembali ke halaman utama
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8">
        Progres Hafalan & Murojaah
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">Hari</th>
              <th className="p-4">Status Hafalan</th>
            </tr>
          </thead>
          <tbody>
            {[
              { day: 'Senin', key: 'monday' },
              { day: 'Selasa', key: 'tuesday' },
              { day: 'Rabu', key: 'wednesday' },
              { day: 'Kamis', key: 'thursday' },
              { day: 'Jumat', key: 'friday' },
              { day: 'Sabtu', key: 'saturday' },
            ].map(({ day, key }) => (
              <tr key={key} className="border-b">
                <td className="p-4">{day}</td>
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={progress[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="w-6 h-6"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Murojaah (Ahad)</h2>
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={progress.review}
              onChange={() => handleCheckboxChange('review')}
              className="w-6 h-6"
            />
            <span>Halaman minggu ini sudah dimurojaah</span>
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
