"use server";

import { getAdminUser } from "@/lib/supabase/admin";

/**
 * Server Action untuk membuat deskripsi produk secara otomatis dengan AI (US-14).
 * Memanfaatkan Gemini API bila GEMINI_API_KEY tersedia, dengan cadangan
 * generator copywriting UMKM cerdas agar sistem tetap andal.
 */
export async function generateDeskripsiAI(nama, kategori = "") {
  try {
    const user = await getAdminUser();
    if (!user) {
      return { error: "Sesi login admin telah berakhir. Silakan login kembali." };
    }

    if (!nama || !nama.trim()) {
      return {
        error: "Silakan masukkan nama produk terlebih dahulu di kolom formulir.",
      };
    }

    const namaBersih = nama.trim();
    const kategoriBersih = (kategori || "").trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Coba panggil Gemini REST API jika GEMINI_API_KEY terkonfigurasi
    if (apiKey) {
      try {
        const prompt = `Anda adalah copywriter profesional untuk produk UMKM Indonesia. Buatkan 1 paragraf deskripsi singkat (2-3 kalimat) yang menarik, menggugah selera/minat pembeli, dan persuasif untuk produk berikut:
Nama Produk: ${namaBersih}
Kategori: ${kategoriBersih || "Umum"}
Instruksi: Tulis deskripsi langsung tanpa pembuka, tanpa tanda kutip, dan tanpa format markdown.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const json = await res.json();
          const teksHasil = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (teksHasil) {
            return { deskripsi: teksHasil };
          }
        }
      } catch (geminiErr) {
        console.warn("Panggilan Gemini API gagal, beralih ke generator lokal:", geminiErr);
      }
    }

    // 2. Generator copywriting UMKM cerdas (fallback teruji)
    const kat = kategoriBersih.toLowerCase();
    let narasi = "";

    if (kat.includes("minuman") || kat.includes("kopi")) {
      narasi = "Diolah secara higienis dari bahan-bahan pilihan berkualitas tinggi untuk menghasilkan kenikmatan aroma khas dan cita rasa autentik. Sangat pas dinikmati hangat maupun dingin untuk menyegarkan hari Anda.";
    } else if (kat.includes("camilan") || kat.includes("keripik") || kat.includes("sambal") || kat.includes("bumbu")) {
      narasi = "Diracik menggunakan bumbu tradisional kaya rempah tanpa bahan pengawet berlebih. Menghadirkan paduan rasa gurih dan renyah yang sempurna sebagai teman santai atau pelengkap hidangan keluarga.";
    } else if (kat.includes("kue") || kat.includes("nastar") || kat.includes("roti")) {
      narasi = "Kudapan manis lembut dengan resep istimewa rumahan yang dipanggang segar. Dikemas rapi dan higienis, sangat cocok untuk suguhan tamu maupun bingkisan hangat bagi orang tersayang.";
    } else if (kat.includes("kain") || kat.includes("batik") || kat.includes("tas") || kat.includes("kerajinan")) {
      narasi = "Dibuat dengan ketelitian tinggi oleh perajin lokal menggunakan material unggulan yang awet dan nyaman digunakan. Memadukan nilai estetika khas nusantara dengan sentuhan modern yang elegan.";
    } else {
      narasi = "Produk unggulan berkualitas yang diproduksi dengan standar kebersihan dan mutu terjamin. Menghadirkan manfaat fungsional terbaik untuk menunjang kebutuhan harian Anda secara optimal.";
    }

    return {
      deskripsi: `${namaBersih}. ${narasi}`,
    };
  } catch (err) {
    console.error("Kesalahan pembuatan deskripsi AI:", err);
    return {
      error: "Terjadi gangguan saat memproses pembuatan deskripsi otomatis.",
    };
  }
}

