import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-driving.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/80 py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Driving school" 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Trophy className="h-4 w-4" />
            Ավելի քան 2000 թեստային հարցեր
          </div>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            Պատրաստվեք վարորդական իրավունքների համար
          </h1>
          
          <p className="mb-8 text-lg text-gray-300 md:text-xl">
            Անցեք թեստեր, ուսումնասիրեք ՀՀ ճանապարհային երթևեկության կանոնները և ձեռք բերեք վստահություն վարման համար
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="btn-hero group">
              Սկսել թեստը
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <BookOpen className="mr-2 h-5 w-5" />
              Ուսումնական նյութեր
            </Button>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">2,134</div>
              <div className="text-sm text-gray-300">Թեստային հարցեր</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">133</div>
              <div className="text-sm text-gray-300">Թեստեր</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">21</div>
              <div className="text-sm text-gray-300">Կատեգորիա</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
