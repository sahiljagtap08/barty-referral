import { infos } from "@/config/landing";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import CompanyLogos from "@/components/sections/company-logos";
import Testimonials from "@/components/sections/testimonials";
import AnimatedPinDemo from "@/components/3d-pin-demo";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <div className="py-10 -mt-20">
        <AnimatedPinDemo />
      </div>
      <CompanyLogos />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}
