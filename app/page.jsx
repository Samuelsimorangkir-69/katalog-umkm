import KatalogInteraktif from "@/components/KatalogInteraktif";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data produk dari Supabase:", error.message);
      pesanError =
        "Terjadi kendala saat memuat katalog produk dari database server. Silakan muat ulang halaman atau hubungi kami jika kendala berlanjut.";
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    console.error("Kesalahan koneksi Supabase:", err.message);
    pesanError =
      "Tidak dapat terhubung ke database. Pastikan konfigurasi environment variable di server telah sesuai.";
  }

  return (
    <div className="flex flex-col gap-10 py-10 sm:py-14">
      {/* Header Toko */}
      <section aria-labelledby="identitas-toko" className="flex flex-col gap-3">
        <h1
          id="identitas-toko"
          className="max-w-2xl text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight tracking-tight text-teks"
        >
          {toko.nama}
        </h1>
        <p className="max-w-xl text-[clamp(1rem,2vw,1.125rem)] text-teks-lembut">
          {toko.tagline}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-teks-lembut">
          <span className="inline-block h-2 w-2 rounded-full bg-utama animate-pulse" />
          <span>{toko.jamBuka}</span>
        </div>
      </section>

      {/* Katalog Produk dengan Pencarian & Filter Real-Time (US-11) */}
      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-garis pb-3">
          <h2 id="judul-produk" className="text-xl font-bold tracking-tight text-teks">
            Produk kami
          </h2>
          {!pesanError && daftarProduk.length > 0 && (
            <span className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              {daftarProduk.length} item tersedia
            </span>
          )}
        </div>

        {/* Status Error */}
        {pesanError ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-garis bg-permukaan p-8 text-center sm:p-12"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bahaya/10 text-bahaya">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-bold text-teks">
              Gagal Memuat Produk
            </h3>
            <p className="max-w-md text-[clamp(0.875rem,1.5vw,1rem)] text-teks-lembut leading-relaxed">
              {pesanError}
            </p>
          </div>
        ) : daftarProduk.length === 0 ? (
          /* Status Kosong */
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-garis bg-permukaan p-8 text-center sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-utama/10 text-utama">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-teks">
              Belum ada produk
            </h3>
            <p className="max-w-md text-[clamp(0.875rem,1.5vw,1rem)] text-teks-lembut leading-relaxed">
              Saat ini etalase produk belum memiliki item yang tersedia untuk ditampilkan. Silakan periksa kembali nanti atau hubungi kami untuk informasi katalog terbaru.
            </p>
          </div>
        ) : (
          /* Katalog Interaktif dengan Filter Real-Time */
          <KatalogInteraktif daftarProduk={daftarProduk} />
        )}
      </section>
    </div>
  );
}
