"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

/**
 * Komponen formulir produk untuk penambahan (US-08) dan pengubahan (US-09).
 */
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(action, null);

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
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          defaultValue={produk.deskripsi || ""}
          placeholder="Tuliskan keterangan detail mengenai produk..."
        />
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
