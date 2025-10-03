import { Car, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Վիրտուալ</h1>
              <p className="text-xs text-muted-foreground">Ավտոդպրոց</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
              Գլխավոր
            </a>
            <a href="#tests" className="text-sm font-medium hover:text-primary transition-colors">
              Թեստեր
            </a>
            <a href="#resources" className="text-sm font-medium hover:text-primary transition-colors">
              Ռեսուրսներ
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              Մեր մասին
            </a>
            <Button variant="default" size="sm" className="btn-hero">
              Սկսել թեստը
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <a href="#home" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Գլխավոր
            </a>
            <a href="#tests" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Թեստեր
            </a>
            <a href="#resources" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Ռեսուրսներ
            </a>
            <a href="#about" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Մեր մասին
            </a>
            <Button variant="default" size="sm" className="w-full btn-hero">
              Սկսել թեստը
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
