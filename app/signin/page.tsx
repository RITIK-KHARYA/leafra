import SignIn from "@/components/custom/sign-in";

export default function SignInPage() {

    return (
        <main className="flex flex-col h-screen w-screen bg-black items-center justify-center">
           <div className="w-full max-w-lg">
             <SignIn />
           </div>
        </main>
    )
}