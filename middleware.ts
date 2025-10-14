import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/web/i18n/routing";

const publicRoutes = ["/login", "/register", "/", "/information"];

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
	// 国際化ミドルウェアを先に実行
	const intlResponse = intlMiddleware(request);

	// セッションチェック
	const sessionCookie = getSessionCookie(request);
	const pathname = request.nextUrl.pathname;

	// ロケールを除いたパスを取得
	const pathnameWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";
	const isPrivateRoute = !publicRoutes.includes(pathnameWithoutLocale);

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie && isPrivateRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return intlResponse;
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};