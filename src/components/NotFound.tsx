import notfound from "/not found.png";

type NotFoundType = {
  isError: boolean;
  handleResetQuiz: (toHome? : boolean) => void;
};

const NotFound = ({ isError, handleResetQuiz }: NotFoundType) => {
  return (
    <div className="bg-linear-to-br from-slate-100 to-blue-50 flex flex-col h-screen items-center justify-center p-6 text-center">
      {/* Gambar Not Found */}
      <img
        src={notfound}
        className="w-64 md:w-100 mb-6  bg-transparent"
        alt="Not Found"
      />

      <div className="max-w-md">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          {isError ? "Koneksi Terganggu" : "Kombinasi Soal Tidak Ditemukan"}
        </h3>
        <p className="text-slate-500 mb-8">
          {isError
            ? "Gagal mengambil data dari server. Periksa koneksi internetmu."
            : "Maaf, Open Trivia DB tidak memiliki soal dengan kategori, kesulitan, atau tipe tersebut. Coba ganti settinganmu."}
        </p>
      </div>

      <button
        onClick={() => handleResetQuiz(true)}
        className="flex items-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-blue-200"
      >
        Go Back & Change Settings
      </button>
    </div>
  );
};

export default NotFound;
