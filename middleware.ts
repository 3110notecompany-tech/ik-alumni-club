import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/login", "/register", "/"];

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
    const isPrivateRoute = !publicRoutes.includes(request.nextUrl.pathname);

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	if (!sessionCookie && isPrivateRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
    
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|llms.txt).*)"],
};