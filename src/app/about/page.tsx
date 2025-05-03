import Link from "next/link";
import { FaHome, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaBookQuran } from "react-icons/fa6";
import { GiOpenBook } from "react-icons/gi";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Islamic decoration */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <FaBookQuran className="text-blue-500 text-4xl mr-3" />
            <h1 className="text-4xl font-bold text-blue-800">
              Tentang <span className="text-blue-600">Aplikasi Quran</span> Kami
            </h1>
          </div>
          <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-blue-100">
          <div className="prose-lg text-blue-900 max-w-none">
            {/* Introduction */}
            <div className="mb-10 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="mb-0 text-lg">
                <GiOpenBook className="inline text-blue-500 mr-2 text-xl" />
                Aplikasi ini merupakan wujud kecintaan kami terhadap Al-Quran,
                dibuat dengan niat ikhlas untuk memudahkan umat Muslim dalam
                membaca, memahami, dan menghafal Kitabullah.
              </p>
            </div>

            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-2 border-b border-blue-200 flex items-center">
                <span className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                Fitur Unggulan
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Teks Arab dengan font khas mushaf Madinah",
                  "Terjemahan Resmi Kemenag RI",
                  "Navigasi per Juz, Surat, dan Halaman",
                  "Mode Hafalan dengan sistem pengulangan",
                  "Tampilan responsive untuk semua perangkat",
                  "Pencarian ayat dengan berbagai kriteria",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-500 mt-1 mr-2">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-2 border-b border-blue-200">
                Tim Pengembang
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Yahya Al-Faruq",
                    role: "Backend Developer",
                    contacts: [
                      {
                        icon: <FaGithub />,
                        url: "https://github.com/gazfath12",
                      },
                      {
                        icon: <FaEnvelope />,
                        url: "mailto:gazfath12@gmail.com",
                      },
                    ],
                  },
                  {
                    name: "Muhammad Raihan Akram Ramadhan",
                    role: "UI/UX Designer",
                    contacts: [
                      {
                        icon: <FaLinkedin />,
                        url: "https://linkedin.com/in/afiqyunanto",
                      },
                      {
                        icon: <FaEnvelope />,
                        url: "mailto:afiqyunanto@gmail.com",
                      },
                    ],
                  },
                ].map((person, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-lg shadow-sm border border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-bold text-blue-800 text-lg">
                      {person.name}
                    </h3>
                    <p className="text-blue-600 text-sm mb-3">{person.role}</p>
                    <div className="flex space-x-3">
                      {person.contacts.map((contact, i) => (
                        <a
                          key={i}
                          href={contact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 bg-white p-2 rounded-full shadow-sm border border-blue-200 hover:border-blue-400 transition-colors"
                        >
                          {contact.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thanks Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-2 border-b border-blue-200">
                Ucapan Terima Kasih
              </h2>

              <div className="space-y-8">
                {[
                  {
                    title: "Keluarga Kami",
                    content:
                      "Terimakasih kepada orang tua kami, Bapak Muhammad Takbir, Bapak Ahmad buhari, Ibu Irmawati Lathifah, Ibu Dwi Lestari, dan seluruh keluarga yang selalu memberikan dukungan dan doa.",
                  },
                  {
                    title: "Para Guru dan Mentor",
                    content:
                      "Ustadz Muhammad Hamid Alwi, LC, Bapak Ariska Hidayat, Bapak Dhanny Ardiansyah, Bapak Saehful Amri, Ustadz Dutha Bahari yang telah membimbing kami dalam memahami Al-Qur'an dan ilmu pengembangan aplikasi.",
                  },
                  {
                    title: "Rekan-rekan Tim",
                    content:
                      "Yahya Al-Faruq, Muhammad Raihan Akram Ramadhan, Raihan Harjuno yang telah bekerja keras mewujudkan aplikasi ini.",
                  },
                  {
                    title: "Sahabat dan Pengguna",
                    content:
                      "Ghifari, Muhammad Afiq Yunanto, Gaza Al-fath Nugroho, Hafidz Karim, dan semua teman yang telah memberikan masukan berharga.",
                  },
                ].map((section, index) => (
                  <div
                    key={index}
                    className="bg-blue-50/50 p-5 rounded-lg border-l-4 border-blue-400"
                  >
                    <h3 className="font-semibold text-blue-700 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-blue-800">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 text-xl mb-4">
                Kontak dan Saran
              </h3>
              <p className="mb-4 text-blue-800">
                Kami sangat menghargai masukan untuk pengembangan aplikasi ini.
                Silakan hubungi kami melalui:
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:jhonelfarq@gmail.com"
                  className="flex items-center text-blue-700 hover:text-blue-900"
                >
                  <FaEnvelope className="mr-3 text-blue-500" />{" "}
                  jhonelfarq@gmail.com
                </a>
                <a
                  href="mailto:raihan.of2008@gmail.com"
                  className="flex items-center text-blue-700 hover:text-blue-900"
                >
                  <FaEnvelope className="mr-3 text-blue-500" />{" "}
                  raihan.of2008@gmail.com
                </a>
                <a
                  href="mailto:raihanregita.ppqita@gmail.com"
                  className="flex items-center text-blue-700 hover:text-blue-900"
                >
                  <FaEnvelope className="mr-3 text-blue-500" />{" "}
                  raihanregita.ppqita@gmail.com
                </a>
              </div>
            </div>

            {/* Quran Verse */}
            <div className="mt-12 p-5 bg-blue-600 text-white rounded-lg text-center">
              <p className="font-arabic text-2xl mb-3">
                وَإِنَّكَ لَتُلَقَّى الْقُرْآنَ مِن لَّدُنْ حَكِيمٍ عَلِيمٍ
              </p>
              <p className="italic">
                Dan sesungguhnya engkau (Muhammad) benar-benar diberi Al-Quran
                dari (Allah) Yang Mahabijaksana, Maha Mengetahui.
              </p>
              <p className="mt-2">QS. An-Naml: 6</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            href="/surat"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <FaHome className="mr-2" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
