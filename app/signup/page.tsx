import SignUp from "@/components/custom/sign-up";

export default function SignUpPage() {
  return (
    <main className="flex flex-col h-screen w-screen bg-black items-center justify-center">
      <div className="w-full max-w-lg">
        <SignUp />
      </div>
    </main>
  );
}
