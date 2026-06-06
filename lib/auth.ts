import { createAuthClient } from "better-auth/client";
import { getSession } from "better-auth/client";

export const authClient = createAuthClient();
export { getSession };
