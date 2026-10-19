import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Halaman utama admin: daftar produk dari database (US-07).
 */
export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data produk admin:", error.message);
      pesanError = "Gagal memuat daftar produk dari database.";
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    console.error("Kesalahan koneksi database:", err.message);
    pesanError = "Terjadi gangguan saat menghubungkan ke database server.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-teks">Produk</h1>
          <p className="mt-0.5 text-sm text-teks-lembut">
            Kelola katalog produk, harga, dan ketersediaan barang toko Anda.
          </p>
        </div>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError ? (
        <div
          role="alert"
          className="rounded-xl border border-bahaya/30 bg-bahaya/10 p-4 text-sm text-bahaya"
        >
          {pesanError}
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
