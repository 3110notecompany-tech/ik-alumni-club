import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/web/i18n/routing";

const publicRoutes = [
  "/login",
  "/signup",
  "/",
  "/information",
  "/supporters",
  "/register/terms",
  "/register/plan",
  "/register/auth",
];
const adminRoutes = ["/admin/login"]; // 管理者ログインページは認証不要

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
	// セッションチェック
	const sessionCookie = getSessionCookie(request);
	const pathname = request.nextUrl.pathname;

	// ロケールを除いたパスを取得
	const pathnameWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";

	// 管理者エリアへのアクセスチェック
	const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");
	const isAdminLoginRoute = adminRoutes.includes(pathnameWithoutLocale);

	// 管理者エリア(ログインページ以外)にアクセスした場合、未ログインなら管理者ログインページへ
	if (isAdminRoute && !isAdminLoginRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/admin/login", request.url));
	}

	// 一般の非公開ルートチェック
	const isPrivateRoute = !publicRoutes.includes(pathnameWithoutLocale) && !isAdminRoute;

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie && isPrivateRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 国際化ミドルウェアを実行
	return intlMiddleware(request);
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};