import { createAuthClient } from "better-auth/react";

const PRODUCTION_URL = "https://leafra-eight.vercel.app";
const DEVELOPER_URL = "http://localhost:3000";
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ??
        (process.env.NODE_ENV === "production" ? PRODUCTION_URL : DEVELOPER_URL));

export const { signIn, signUp, useSession, getSession, signOut, $Infer } =
  createAuthClient({ baseURL });

const dashboardCallback = `${baseURL}/dashboard`;

export const signInWithGithub = async () => {
  await signIn.social({ provider: "github", callbackURL: dashboardCallback });
};
export const signInWithDiscord = async () => {
  await signIn.social({ provider: "discord", callbackURL: dashboardCallback });
};
export const signInWithGoogle = async () => {
  await signIn.social({ provider: "google", callbackURL: dashboardCallback });
};

export const signUpWithGithub = async () => {
  await signIn.social({ provider: "github", callbackURL: dashboardCallback });
};
export const signUpWithDiscord = async () => {
  await signIn.social({ provider: "discord", callbackURL: dashboardCallback });
};
export const signUpWithGoogle = async () => {
  await signIn.social({ provider: "google", callbackURL: dashboardCallback });
};

export const signout = async () => {
  await signOut();
};

export type Session = typeof $Infer.Session;
