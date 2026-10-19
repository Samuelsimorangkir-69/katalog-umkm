"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const [produkDipilih, setProdukDipilih] = useState(null);
  const [sedangMenghapus, setSedangMenghapus] = useState(false);
  const [pesanError, setPesanError] = useState(null);

  const bukaKonfirmasiHapus = (produk) => {
    setPesanError(null);
    setProdukDipilih(produk);
  };

  const tutupModal = () => {
    if (sedangMenghapus) return;
    setProdukDipilih(null);
    setPesanError(null);
  };

  const konfirmasiDanHapus = async () => {
    if (!produkDipilih) return;
    setSedangMenghapus(true);
    setPesanError(null);

    const hasil = await hapusProduk(produkDipilih.id);
    if (hasil?.error) {
      setPesanError(hasil.error);
      setSedangMenghapus(false);
    } else {
      setSedangMenghapus(false);
      setProdukDipilih(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Harga</th>
              <th className="px-4 py-3 font-semibold text-right">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-teks-lembut">
                  Belum ada produk di database. Klik &ldquo;Tambah produk&rdquo; untuk menambahkan item pertama.
                </td>
              </tr>
            ) : (
              daftarProduk.map((produk) => (
                <tr
                  key={produk.id}
                  className="border-t border-garis transition-colors hover:bg-permukaan/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={produk.foto_url || "/produk/kopi.svg"}
                        alt=""
                        className="h-10 w-10 rounded-md border border-garis bg-permukaan object-cover"
                      />
                      <span className="font-semibold text-teks">{produk.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">
                    {produk.kategori || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-teks">
                    {formatRupiah(produk.harga)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      <Tombol
                        type="button"
                        varian="bahaya"
                        onClick={() => bukaKonfirmasiHapus(produk)}
                      >
                        Hapus
                      </Tombol>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Popup Konfirmasi Hapus Produk (Navy & Gold Theme) */}
      {produkDipilih && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-modal-hapus"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md rounded-2xl border border-garis bg-latar p-6 shadow-2xl transition-all sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bahaya/10 text-bahaya">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 id="judul-modal-hapus" className="text-lg font-bold text-teks">
                  Hapus Produk?
                </h3>
                <p className="text-sm leading-relaxed text-teks-lembut">
                  Apakah Anda yakin ingin menghapus produk{" "}
                  <strong className="text-teks">{produkDipilih.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            {pesanError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-bahaya/30 bg-bahaya/10 p-3 text-xs font-medium text-bahaya"
              >
                {pesanError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Tombol
                type="button"
                varian="garis"
                disabled={sedangMenghapus}
                onClick={tutupModal}
              >
                Batal
              </Tombol>
              <button
                type="button"
                disabled={sedangMenghapus}
                onClick={konfirmasiDanHapus}
                className="inline-flex items-center justify-center rounded-lg bg-bahaya px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {sedangMenghapus ? "Menghapus..." : "Ya, Hapus Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
