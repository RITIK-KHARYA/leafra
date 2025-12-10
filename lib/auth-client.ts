import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, getSession, signOut, $Infer } =
  createAuthClient({
    baseURL: "http://localhost:3000",
  });

export const signInWithGithub = async () => {
  await signIn.social({
    provider: "github",
    callbackURL: "http://localhost:3000/dashboard",
  });
};
export const signInWithDiscord = async () => {
  await signIn.social({
    provider: "discord",
    callbackURL: "http://localhost:3000/dashboard",
  });
};
export const signInWithGoogle = async () => {
  await signIn.social({
    provider: "google",
    callbackURL: "http://localhost:3000/dashboard",
  });
};

export const signUpWithGithub = async () => {
  await signUp.social({
    provider: "github",
    callbackURL: "http://localhost:3000/dashboard",
  });
};

export const signUpWithDiscord = async () => {
  await signUp.social({
    provider: "discord",
    callbackURL: "http://localhost:3000/dashboard",
  });
};

export const signUpWithGoogle = async () => {
  await signUp.social({
    provider: "google",
    callbackURL: "http://localhost:3000/dashboard",
  });
};

export const signout = async () => {
  await signOut();
};

export type Session = typeof $Infer.Session;
