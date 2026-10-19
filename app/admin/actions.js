"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Helper: memastikan admin sudah login sebelum menjalankan aksi yang mengubah data.
 * Mengembalikan objek { supabase, user } atau melempar error jika belum terotentikasi.
 */
async function requireAdmin() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHORIZED");
  }

  return { supabase, user };
}

/**
 * Server Action untuk autentikasi login admin menggunakan Supabase Auth.
 */
export async function login(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  const email = data.get("email");
  const password = data.get("password");

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  let signInError = null;

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      console.error("Autentikasi gagal:", error.message);
      signInError = "Email atau kata sandi tidak sesuai. Silakan periksa kembali.";
    }
  } catch (err) {
    console.error("Terjadi kendala saat login:", err.message);
    signInError = "Terjadi gangguan saat memproses login. Silakan coba lagi beberapa saat.";
  }

  if (signInError) {
    return { error: signInError };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi admin (logout) dan membersihkan cookie.
 */
export async function logout() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Kesalahan saat logout:", err.message);
  }

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

/**
 * Server Action untuk mengganti kata sandi admin yang sedang login.
 * Memeriksa status login di server sebelum mengeksekusi perubahan.
 */
export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  const passwordBaru = data.get("password_baru");
  const konfirmasiPassword = data.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom kata sandi wajib diisi." };
  }

  if (String(passwordBaru).length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password harus sama dengan password baru." };
  }

  try {
    const { supabase } = await requireAdmin();

    const { error: updateError } = await supabase.auth.updateUser({
      password: String(passwordBaru),
    });

    if (updateError) {
      console.error("Gagal memperbarui password:", updateError.message);
      return {
        error: "Gagal mengganti password. Silakan coba beberapa saat lagi.",
      };
    }

    return {
      success: true,
      pesan: "Password berhasil diganti.",
    };
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return {
        error: "Sesi login tidak valid atau telah berakhir. Silakan login kembali.",
      };
    }
    console.error("Kesalahan saat memperbarui password:", err.message);
    return {
      error: "Terjadi gangguan saat memproses perubahan password. Silakan coba lagi.",
    };
  }
}
