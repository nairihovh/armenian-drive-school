import { Car } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-none">Վիրտուալ Ավտոդպրոց</h3>
                <p className="text-xs text-muted-foreground">Ձեր հաջողության գործընկերը</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Պատրաստվեք վարորդական իրավունքների քննությանը մեր ժամանակակից թեստավորման համակարգի միջոցով։
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold">Նավիգացիա</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#home" className="hover:text-primary transition-colors">Գլխավոր</a></li>
              <li><a href="#tests" className="hover:text-primary transition-colors">Թեստեր</a></li>
              <li><a href="#resources" className="hover:text-primary transition-colors">Ռեսուրսներ</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Մեր մասին</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold">Օգնություն</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#faq" className="hover:text-primary transition-colors">ՀՏՀ</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Կապ</a></li>
              <li><a href="#privacy" className="hover:text-primary transition-colors">Գաղտնիություն</a></li>
              <li><a href="#terms" className="hover:text-primary transition-colors">Պայմաններ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Վիրտուալ Ավտոդպրոց։ Բոլոր իրավունքները պաշտպանված են։</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
