import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  try {
    const supabase = createServerClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Semua rute /admin kecuali /admin/login wajib memiliki sesi aktif
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }

    // Jika sudah login, arahkan dari /admin/login ke /admin
    if (pathname === "/admin/login" && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Kesalahan otentikasi pada proxy:", error);
    // Jika rute admin gagal diverifikasi, arahkan ke login demi keamanan
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
