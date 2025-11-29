import { getSession } from "@auth0/nextjs-auth0";

export const auth0 = {
  async getSession() {
    return getSession();
  },
  async requireSession() {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");
    return session;
  },
};
