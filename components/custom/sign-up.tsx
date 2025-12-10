"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  signUp,
  signUpWithDiscord,
  signUpWithGithub,
  signUpWithGoogle,
} from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingDiscord, setLoadingDiscord] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const router = useRouter();

  const handleEmailSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoadingEmail(true);
    try {
      await signUp.email({
        email,
        password,
        name: email.split("@")[0], // Use email prefix as default name
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
      setLoadingEmail(false);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEmailSignUp();
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
          src={"/logo.png"}
          alt="logo"
          className="h-20 w-20 rounded-full object-cover flex items-center justify-center"
        />
        <div className="text-center space-y-1">
          <h1 className="text-5xl font-medium font-instrument-serif">
            Join Leafra
          </h1>
          <p className="text-sm text-zinc-400">
            Create an account to get started
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
                await signUpWithGoogle();
              } finally {
                setLoadingGoogle(false);
              }
            }}
          >
            {loadingGoogle ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="/google.svg" className="h-4 w-4" />
            )}
            <p>Sign up with Google</p>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black border border-neutral-700 shadow-[inset_0_3px_3.5px_rgba(255,255,255,0.25)] shadow-neutral-800 font-[330] text-sm text-white hover:bg-neutral-900 active:scale-[0.98] active:shadow-[inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all duration-75"
            disabled={loadingDiscord}
            onClick={async () => {
              setLoadingDiscord(true);
              try {
                await signUpWithDiscord();
              } finally {
                setLoadingDiscord(false);
              }
            }}
          >
            {loadingDiscord ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="discordd.png" className="h-7 w-7" />
            )}
            <p>Sign up with Discord</p>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black border border-neutral-700 shadow-[inset_0_3px_3.5px_rgba(255,255,255,0.25)] shadow-neutral-800 font-[330] text-sm text-white hover:bg-neutral-900 active:scale-[0.98] active:shadow-[inset_0_2px_2px_rgba(255,255,255,0.15)] transition-all duration-75"
            disabled={loadingGithub}
            onClick={async () => {
              setLoadingGithub(true);
              try {
                await signUpWithGithub();
              } finally {
                setLoadingGithub(false);
              }
            }}
          >
            {loadingGithub ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="/github.png" className="h-6 w-6" />
            )}
            <p>Sign up with Github</p>
          </Button>

          <div className="text-center text-xs text-zinc-500">or</div>

          <div className="space-y-5">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-zinc-800 text-white placeholder:text-zinc-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEnterKey}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-transparent border-zinc-800 text-white placeholder:text-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleEnterKey}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              className="bg-transparent border-zinc-800 text-white placeholder:text-zinc-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleEnterKey}
            />
            <Button
              className="w-full bg-white text-black hover:bg-zinc-200 active:scale-[0.98] active:bg-zinc-300 transition-all duration-75"
              disabled={
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                loadingEmail
              }
              onClick={handleEmailSignUp}
            >
              {loadingEmail ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </div>
        </div>

        <div className="text-center text-[11px] text-zinc-500">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </main>
  );
}
