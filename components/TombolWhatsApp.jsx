"use client";

import { useState, useMemo } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

/**
 * Komponen Pemesanan WhatsApp dengan Selector Jumlah & Varian (US-03 & US-12).
 */
export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  // Menentukan pilihan varian yang relevan berdasarkan kategori produk
  const opsiVarian = useMemo(() => {
    const kat = (produk.kategori || "").toLowerCase();
    if (kat.includes("minuman") || kat.includes("kopi")) {
      return ["Giling Halus", "Biji Utuh", "Giling Kasar"];
    }
    if (kat.includes("camilan") || kat.includes("bumbu") || kat.includes("sambal")) {
      return ["Original", "Pedas Sedang", "Ekstra Pedas"];
    }
    if (kat.includes("kue")) {
      return ["Toples Reguler", "Paket Hadiah / Hampers"];
    }
    if (kat.includes("kain") || kat.includes("batik") || kat.includes("tas") || kat.includes("kerajinan")) {
      return ["Motif Standar", "Edisi Premium"];
    }
    return ["Standar / Reguler", "Kemasan Spesial"];
  }, [produk.kategori]);

  const [varianTerpilih, setVarianTerpilih] = useState(opsiVarian[0]);

  const kurangiJumlah = () => {
    setJumlah((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const tambahJumlah = () => {
    setJumlah((prev) => prev + 1);
  };

  const handleInputJumlah = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setJumlah(val);
    } else if (e.target.value === "") {
      setJumlah(1);
    }
  };

  const totalHarga = formatRupiah(produk.harga * jumlah);
  const nomorTujuan = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  // Menyusun format pesan WhatsApp yang otomatis memuat nama, varian, jumlah, dan total harga
  const pesan = [
    `Halo ${toko.nama}, saya ingin memesan:`,
    `• Produk: *${produk.nama}*`,
    `• Varian: ${varianTerpilih}`,
    `• Jumlah: ${jumlah} item`,
    `• Total Estimasi: ${totalHarga}`,
    ``,
    `Apakah pesanan ini masih tersedia? Terima kasih!`,
  ].join("\n");

  const urlWhatsApp = `https://wa.me/${nomorTujuan}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-5 pt-3">
      {/* Pilihan Varian (US-12) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
          Pilihan Varian:
        </label>
        <div className="flex flex-wrap gap-2">
          {opsiVarian.map((varian) => {
            const isDipilih = varianTerpilih === varian;
            return (
              <button
                key={varian}
                type="button"
                onClick={() => setVarianTerpilih(varian)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isDipilih
                    ? "border-utama bg-utama/10 text-utama ring-1 ring-utama"
                    : "border border-garis bg-latar text-teks-lembut hover:border-teks-lembut hover:text-teks"
                }`}
              >
                {varian}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector Jumlah Kuantitas (US-12) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-garis bg-permukaan/60 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-teks">Jumlah:</span>
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={kurangiJumlah}
              disabled={jumlah <= 1}
              className="flex h-8 w-8 items-center justify-center text-base font-bold text-teks hover:bg-permukaan disabled:opacity-30 disabled:hover:bg-transparent"
              title="Kurangi jumlah"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={jumlah}
              onChange={handleInputJumlah}
              className="h-8 w-12 border-x border-garis text-center text-sm font-bold text-teks focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={tambahJumlah}
              className="flex h-8 w-8 items-center justify-center text-base font-bold text-teks hover:bg-permukaan"
              title="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-teks-lembut">Total:</span>
          <span className="rounded-md bg-harga-latar px-2.5 py-1 text-sm font-bold text-harga">
            {totalHarga}
          </span>
        </div>
      </div>

      {/* Tombol Pemesanan WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-utama px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-utama-gelap sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
        </svg>
        <span>Pesan via WhatsApp ({totalHarga})</span>
      </a>
    </div>
  );
}
