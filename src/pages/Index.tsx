import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { AuthRedirect } from "@/components/AuthRedirect";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AuthRedirect />
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
