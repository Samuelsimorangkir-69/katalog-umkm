import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

/**
 * Halaman tambah produk baru admin (US-08).
 */
export default function HalamanTambahProduk() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold text-teks">Tambah produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Masukkan detail produk baru untuk ditambahkan ke katalog etalase toko.
        </p>
      </div>
      <FormProduk labelTombol="Simpan produk" action={tambahProduk} />
    </div>
  );
}
