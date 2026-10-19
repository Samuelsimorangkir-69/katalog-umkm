"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

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

