"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDeskripsiAI } from "@/app/admin/ai-actions";

/**
 * Komponen formulir produk untuk penambahan (US-08) dan pengubahan (US-09),
 * dilengkapi tombol generator deskripsi bertenaga AI (US-14).
 */
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [sedangGenerateAI, setSedangGenerateAI] = useState(false);
  const [aiNotifikasi, setAiNotifikasi] = useState(null);

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    const namaInput = form?.querySelector('input[name="nama"]')?.value;
    const kategoriInput = form?.querySelector('input[name="kategori"]')?.value;

    if (!namaInput || !namaInput.trim()) {
      setAiNotifikasi({
        tipe: "error",
        pesan: "Mohon isi nama produk terlebih dahulu sebelum membuat deskripsi.",
      });
      return;
    }

    setSedangGenerateAI(true);
    setAiNotifikasi(null);

    const res = await generateDeskripsiAI(namaInput, kategoriInput);
    if (res?.error) {
      setAiNotifikasi({ tipe: "error", pesan: res.error });
    } else if (res?.deskripsi) {
      setDeskripsi(res.deskripsi);
      setAiNotifikasi({
        tipe: "sukses",
        pesan: "Deskripsi berhasil dibuat dengan AI! Anda masih dapat mengeditnya jika diperlukan.",
      });
    }
    setSedangGenerateAI(false);
  };

  return (
    <div className="max-w-xl rounded-2xl border border-garis bg-latar p-6 shadow-sm sm:p-8">
      {state?.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-bahaya/30 bg-bahaya/10 p-3.5 text-sm font-medium text-bahaya"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {produk.id && <input type="hidden" name="id" value={produk.id} />}

        <Input
          label="Nama produk"
          name="nama"
          defaultValue={produk.nama || ""}
          placeholder="Contoh: Kopi Robusta 250 g"
          required
        />
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={produk.harga !== undefined ? produk.harga : ""}
          placeholder="Contoh: 45000"
          required
        />
        <Input
          label="Kategori"
          name="kategori"
          defaultValue={produk.kategori || ""}
          placeholder="Contoh: Minuman, Camilan, Kerajinan"
        />
        <Input
          label="Link foto"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          defaultValue={produk.foto_url || ""}
        />

        {/* Kolom Deskripsi dengan Tombol AI Generator (US-14) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-teks">Deskripsi</label>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={sedangGenerateAI}
              className="inline-flex items-center gap-1.5 rounded-lg border border-utama/30 bg-utama/5 px-2.5 py-1 text-xs font-semibold text-utama transition-colors hover:bg-utama/10 disabled:opacity-50"
              title="Buat deskripsi otomatis berdasarkan nama dan kategori produk"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{sedangGenerateAI ? "Menulis..." : "Generate Deskripsi dengan AI"}</span>
            </button>
          </div>

          <textarea
            name="deskripsi"
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            placeholder="Tuliskan keterangan detail mengenai produk..."
          />

          {aiNotifikasi && (
            <p
              className={`text-xs ${
                aiNotifikasi.tipe === "error" ? "text-bahaya" : "text-utama"
              }`}
            >
              {aiNotifikasi.pesan}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Tombol type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : labelTombol}
          </Tombol>
          <Tombol href="/admin" varian="garis">
            Batal
          </Tombol>
        </div>
      </form>
    </div>
  );
}
