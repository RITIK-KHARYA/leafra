import Image from "next/image";
import Link from "next/link";



export default function Header() {
    return (
        <header className="">
            <div className="flex items-center justify-between">
                <Link href="/" >
                <div className="flex gap-4 ">
                    <Image
                        src={"/mainlogo.png"}
                        alt="logo"
                        className="object-center"
                        about="logo"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-xl font-semibold tracking-wide flex items-center">
                        Leafra.ai
                    </h1>
                </div>
                </Link>
            </div>
        </header>
    )
}