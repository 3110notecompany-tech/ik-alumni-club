import { createAuthClient } from "better-auth/react"
import { getBaseURL } from '@/lib/get-base-url';
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
	  plugins: [inferAdditionalFields<typeof auth>(),anonymousClient()],
})