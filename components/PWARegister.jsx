"use client";

import { useEffect } from "react";

/**
 * Komponen pendaftaran Service Worker untuk PWA (US-13).
 */
export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch(() => {
            // Pendaftaran SW diabaikan jika berjalan pada konteks yang tidak didukung
          });
      });
    }
  }, []);

  return null;
}

