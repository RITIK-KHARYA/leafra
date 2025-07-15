import Footer from "@/components/custom/footer";
import Hero from "@/components/custom/Hero";
import LandingGrid from "@/components/custom/landinggrid";
import Spiral3DComponent from "@/components/custom/spiral";
import SpiralComponent from "@/components/custom/spiral"; 

export default function Home() {
  return (
    <main>
      <div className="text-white">
        <Hero />
        {/* <Spiral3DComponent /> */}
        <LandingGrid />
        {/* animation slice */}
        {/* bento grids */}
        {/* features  */}
        {/* accordian */}
        <div className="absolute inset-x-12 text-center z-10 text-9xl bg-clip-text bg-gradient-to-t bg-neutral-800 via-neutral-900 to-black">
          <div className="relative">Leafra</div>
        </div>
        <footer className="relative h-full w-full flex justify-center items-center">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <Footer />
        </footer>
      </div>
    </main>
  );
}
