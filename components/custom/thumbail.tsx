import Image from "next/image";

export default function Thumbnail() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-neutral-700/80">
      <Image
        src={"/hero.png"}
        alt="hero"
        width={900}
        height={900}
        className="object-cover"
      />
    </div>
  );
}
