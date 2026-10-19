import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase dengan sesi admin (menggunakan SUPABASE_PUBLISHABLE_KEY dan cookie).
 * Digunakan untuk login, logout, ganti password, dan mutasi data produk di sisi server.
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY telah diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Diabaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

/**
 * Mengambil data akun user admin yang sedang login dari sesi cookie.
 * Mengembalikan user Supabase atau null jika belum terotentikasi.
 */
export async function getAdminUser() {
  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

