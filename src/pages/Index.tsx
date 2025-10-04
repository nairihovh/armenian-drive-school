import Header from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TestCategories } from "@/components/TestCategories";
import { FeaturesSection } from "@/components/FeaturesSection";
import { APITest } from "@/components/APITest";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TestCategories />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
