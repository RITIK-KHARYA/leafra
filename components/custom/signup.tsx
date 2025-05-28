"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function AuthComponent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4 text-white font-sans">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Decorative blur blob */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 opacity-20 z-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-full blur-3xl" />
      </div>

      {/* Geometric decorations */}
      <div className="absolute top-20 right-[20%] w-40 h-40 border border-gray-800 rounded-full opacity-20" />
      <div className="absolute bottom-20 left-[20%] w-60 h-60 border border-gray-800 rounded-full opacity-10" />
      <div className="absolute top-[40%] left-[15%] w-20 h-20 border border-gray-800 rounded-full opacity-20" />

      {/* Auth Card */}
      <Card className="w-full max-w-md bg-black border border-gray-800 backdrop-blur-sm relative z-10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            {isSignUp
              ? "Join us by filling the form below."
              : "Sign in to your account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="Your Name"
                  className="pl-10 bg-black border-gray-700 text-white"
                />
                <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="you@example.com"
                className="pl-10 bg-black border-gray-700 text-white"
              />
              <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10 bg-black border-gray-700 text-white"
              />
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  className="pl-10 pr-10 bg-black border-gray-700 text-white"
                />
                <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <Button className="w-full bg-white text-black hover:bg-gray-200 font-medium transition-all">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <div className="text-sm text-center text-gray-400">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-blue-400 hover:text-blue-300 p-0 h-auto"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
