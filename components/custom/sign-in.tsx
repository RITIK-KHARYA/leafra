"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  signIn,
  signInWithDiscord,
  signInWithGithub,
  signInWithGoogle,
} from "@/lib/auth-client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingDiscord, setLoadingDiscord] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setLoadingEmail(true);
    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setLoadingEmail(false);
          },
          onSuccess: async () => {
            router.push("/dashboard");
          },
        },
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setLoadingEmail(false);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailSignIn();
    }
  };

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-black text-white flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/fullbackground.png')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        maskImage: "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.5))",
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <img
          src={"/logo2.png"}
          alt="logo"
          className="h-20 w-20 rounded-full object-cover flex items-center justify-center"
        />
        <div className="text-center space-y-1">
          <h1 className="text-5xl font-medium font-instrument-serif">
            Welcome Back !
          </h1>
          <p className="text-4xl text-neutral-200 font-medium font-instrument-serif">
            Login to your account
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            variant="outline"
            className="w-full bg-black border border-neutral-700 shadow-[inset_0_3px_3.5px_rgba(255,255,255,0.25)] shadow-neutral-800 font-[330] text-sm text-white hover:bg-neutral-900 active:scale-[0.98] active:shadow-[inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all duration-75"
            disabled={loadingGoogle}
            onClick={async () => {
              setLoadingGoogle(true);
              try {
                await signInWithGoogle();
              } finally {
                setLoadingGoogle(false);
              }
            }}
          >
            {loadingGoogle ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="/google.svg" className="h-4 w-4 m-1" />
            )}
            <p>Sign in with Google</p>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black border border-neutral-700 shadow-[inset_0_3px_3.5px_rgba(255,255,255,0.25)] shadow-neutral-800 font-[330] text-sm text-white hover:bg-neutral-900 active:scale-[0.98] active:shadow-[inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all duration-75"
            disabled={loadingDiscord}
            onClick={async () => {
              setLoadingDiscord(true);
              try {
                await signInWithDiscord();
              } finally {
                setLoadingDiscord(false);
              }
            }}
          >
            {loadingDiscord ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="/discord.svg" className="h-5 w-5 invert m-1" />
            )}
            <p>Sign in with Discord</p>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black border border-neutral-700 shadow-[inset_0_3px_3.5px_rgba(255,255,255,0.25)] shadow-neutral-800 font-[330] text-sm text-white hover:bg-neutral-900 active:scale-[0.98] active:shadow-[inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all duration-75"
            disabled={loadingGithub}
            onClick={async () => {
              setLoadingGithub(true);
              try {
                await signInWithGithub();
              } finally {
                setLoadingGithub(false);
              }
            }}
          >
            {loadingGithub ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="/githubblack.png" className="h-6 w-6" />
            )}
            <p>Sign in with Github</p>
          </Button>

          <div className="text-center text-xs text-zinc-500">or</div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-zinc-800 text-white placeholder:text-zinc-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEnterKey}
              disabled={loadingEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-transparent border-zinc-800 text-white placeholder:text-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleEnterKey}
              disabled={loadingEmail}
            />
            <Button
              className="w-full bg-white text-black hover:bg-neutral-100 font-medium"
              onClick={handleEmailSignIn}
              disabled={loadingEmail || !email || !password}
            >
              {loadingEmail ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Sign in with Email"
              )}
            </Button>
          </div>

          <p className="text-xs text-zinc-500 text-center pt-2">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-white hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
