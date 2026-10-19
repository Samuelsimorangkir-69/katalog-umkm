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
 * Server Action untuk mengganti kata sandi admin yang sedang login (US-05).
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

/**
 * Server Action untuk menambah produk baru ke database Supabase (US-08).
 * Wajib terkunci login admin di sisi server.
 */
export async function tambahProduk(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  try {
    const { supabase } = await requireAdmin();

    const nama = data.get("nama")?.toString().trim();
    const hargaStr = data.get("harga")?.toString().trim();
    const kategori = data.get("kategori")?.toString().trim() || null;
    const foto_url = data.get("foto_url")?.toString().trim() || null;
    const deskripsi = data.get("deskripsi")?.toString().trim() || null;

    if (!nama) {
      return { error: "Nama produk wajib diisi." };
    }

    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      return { error: "Harga produk harus berupa angka nominal yang valid (tidak negatif)." };
    }

    const { error } = await supabase.from("produk").insert({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    });

    if (error) {
      console.error("Gagal menambah produk:", error.message);
      return { error: "Gagal menyimpan produk ke database. Silakan periksa isian data." };
    }
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return { error: "Sesi login tidak valid atau telah berakhir. Silakan login kembali." };
    }
    console.error("Kesalahan tambah produk:", err.message);
    return { error: "Terjadi gangguan sistem saat menambahkan produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

/**
 * Server Action untuk memperbarui data produk yang ada di Supabase (US-09).
 * Wajib terkunci login admin di sisi server.
 */
export async function ubahProduk(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
      ? prevState
      : null;

  if (!data) {
    return { error: "Data formulir tidak valid." };
  }

  let idProduk = null;

  try {
    const { supabase } = await requireAdmin();

    idProduk = data.get("id");
    if (!idProduk) {
      return { error: "ID produk tidak valid atau tidak ditemukan." };
    }

    const nama = data.get("nama")?.toString().trim();
    const hargaStr = data.get("harga")?.toString().trim();
    const kategori = data.get("kategori")?.toString().trim() || null;
    const foto_url = data.get("foto_url")?.toString().trim() || null;
    const deskripsi = data.get("deskripsi")?.toString().trim() || null;

    if (!nama) {
      return { error: "Nama produk wajib diisi." };
    }

    const harga = parseInt(hargaStr, 10);
    if (isNaN(harga) || harga < 0) {
      return { error: "Harga produk harus berupa angka nominal yang valid (tidak negatif)." };
    }

    const { error } = await supabase
      .from("produk")
      .update({
        nama,
        harga,
        kategori,
        foto_url,
        deskripsi,
      })
      .eq("id", idProduk);

    if (error) {
      console.error("Gagal mengubah produk:", error.message);
      return { error: "Gagal menyimpan perubahan ke database. Silakan coba lagi." };
    }
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return { error: "Sesi login tidak valid atau telah berakhir. Silakan login kembali." };
    }
    console.error("Kesalahan ubah produk:", err.message);
    return { error: "Terjadi gangguan sistem saat memperbarui produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  if (idProduk) {
    revalidatePath(`/produk/${idProduk}`);
  }
  redirect("/admin");
}

/**
 * Server Action untuk menghapus produk dari database Supabase (US-10).
 * Wajib terkunci login admin di sisi server.
 */
export async function hapusProduk(id) {
  try {
    const { supabase } = await requireAdmin();

    if (!id) {
      return { error: "ID produk tidak valid." };
    }

    const { error } = await supabase.from("produk").delete().eq("id", id);

    if (error) {
      console.error("Gagal menghapus produk:", error.message);
      return { error: "Gagal menghapus produk dari database." };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return { error: "Sesi login tidak valid atau telah berakhir. Silakan login kembali." };
    }
    console.error("Kesalahan hapus produk:", err.message);
    return { error: "Terjadi gangguan sistem saat menghapus produk." };
  }
}
