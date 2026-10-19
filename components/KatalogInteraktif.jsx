"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

/**
 * Komponen Katalog Interaktif dengan Pencarian & Filter Kategori Real-Time (US-11).
 */
export default function KatalogInteraktif({ daftarProduk = [] }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // Ekstraksi daftar kategori unik secara dinamis dari produk yang ada
  const daftarKategori = useMemo(() => {
    const unik = new Set();
    daftarProduk.forEach((item) => {
      if (item.kategori && item.kategori.trim() !== "") {
        unik.add(item.kategori.trim());
      }
    });
    return ["Semua", ...Array.from(unik)];
  }, [daftarProduk]);

  // Penyaringan produk secara real-time berdasarkan teks pencarian dan kategori
  const produkTersaring = useMemo(() => {
    const kataKunci = cari.toLowerCase().trim();

    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriAktif === "Semua" ||
        (produk.kategori && produk.kategori.trim() === kategoriAktif);

      const namaCocok =
        produk.nama && produk.nama.toLowerCase().includes(kataKunci);
      const deskripsiCocok =
        produk.deskripsi && produk.deskripsi.toLowerCase().includes(kataKunci);

      return cocokKategori && (kataKunci === "" || namaCocok || deskripsiCocok);
    });
  }, [daftarProduk, cari, kategoriAktif]);

  const handleReset = () => {
    setCari("");
    setKategoriAktif("Semua");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian & Filter Kategori */}
      <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan/50 p-4 sm:p-5">
        {/* Kolom Pencarian */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teks-lembut">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama atau keterangan produk..."
            className="w-full rounded-xl border border-garis bg-latar py-2.5 pl-10 pr-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none focus:ring-2 focus:ring-utama/20"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-teks-lembut hover:text-teks"
              title="Bersihkan pencarian"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Tombol Pilihan Kategori */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
            Kategori:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {daftarKategori.map((kat) => {
              const isAktif = kategoriAktif === kat;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategoriAktif(kat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                    isAktif
                      ? "bg-utama text-white shadow-sm"
                      : "border border-garis bg-latar text-teks-lembut hover:border-teks-lembut hover:text-teks"
                  }`}
                >
                  {kat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Informasi Jumlah Hasil Saring */}
      <div className="flex items-center justify-between text-xs font-medium text-teks-lembut">
        <span>
          Menampilkan {produkTersaring.length} dari {daftarProduk.length} produk
        </span>
        {(cari || kategoriAktif !== "Semua") && (
          <button
            type="button"
            onClick={handleReset}
            className="text-utama underline hover:opacity-80"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Status Bila Hasil Filter Kosong */}
      {produkTersaring.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-garis bg-permukaan p-8 text-center sm:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-utama/10 text-utama">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-teks">
            Tidak Ada Produk yang Cocok
          </h3>
          <p className="max-w-md text-sm text-teks-lembut leading-relaxed">
            Tidak ditemukan produk dengan kata kunci{" "}
            {cari ? `"${cari}"` : ""} pada kategori &ldquo;{kategoriAktif}&rdquo;.
            Coba gunakan kata kunci lain atau bersihkan filter.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Tampilkan Semua Produk
          </button>
        </div>
      ) : (
        /* Grid Produk Responsif (2 kolom di HP, 3 kolom di desktop) */
        <div className="grid grid-cols-2 gap-4 transition-all duration-300 ease-in-out md:grid-cols-3 md:gap-6">
          {produkTersaring.map((produk) => (
            <div
              key={produk.id}
              className="rounded-2xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
            >
              <KartuProduk produk={produk} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

