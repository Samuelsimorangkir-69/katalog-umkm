import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase sisi server dengan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk)
 * di sisi server tanpa sesi login pengunjung (melewati RLS untuk operasi baca publik).
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY telah diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

