import { CategoryCard } from "./CategoryCard";
import { 
  AlertTriangle, 
  Car, 
  Construction, 
  Gauge, 
  MapPin, 
  Shield,
  SignalHigh,
  Siren
} from "lucide-react";

const categories = [
  {
    title: "Երթևեկության կանոններ",
    description: "Հիմնական երթևեկության կանոններ և նորմեր",
    questionCount: 320,
    icon: Shield,
    color: "bg-primary"
  },
  {
    title: "Ճանապարհային նշաններ",
    description: "Արգելող, պահանջող և տեղեկատվական նշաններ",
    questionCount: 450,
    icon: AlertTriangle,
    color: "bg-accent"
  },
  {
    title: "Տեխնիկական սարքավորումներ",
    description: "Ավտոմեքենայի սարքավորումներ և տեխնիկական պահպանում",
    questionCount: 280,
    icon: Construction,
    color: "bg-blue-600"
  },
  {
    title: "Արագություն և հեռավորություն",
    description: "Արագության սահմանափակումներ և անվտանգ հեռավորություններ",
    questionCount: 195,
    icon: Gauge,
    color: "bg-green-600"
  },
  {
    title: "Գլխավոր ճանապարհ",
    description: "Գլխավոր ճանապարհի կանոններ և առաջնահերթություն",
    questionCount: 220,
    icon: MapPin,
    color: "bg-purple-600"
  },
  {
    title: "Արտակարգ իրավիճակներ",
    description: "Արտակարգ իրավիճակների կանոններ և անվտանգություն",
    questionCount: 165,
    icon: Siren,
    color: "bg-red-600"
  },
  {
    title: "Ազդանշաններ",
    description: "Լուսային և ձեռքի ազդանշաններ",
    questionCount: 140,
    icon: SignalHigh,
    color: "bg-yellow-600"
  },
  {
    title: "Ընդհանուր",
    description: "Ընդհանուր հարցեր և խառը թեստեր",
    questionCount: 364,
    icon: Car,
    color: "bg-gray-600"
  }
];

export const TestCategories = () => {
  return (
    <section id="tests" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ընտրեք թեստի կատեգորիա
          </h2>
          <p className="text-lg text-muted-foreground">
            Ուսումնասիրեք տարբեր կատեգորիաներ և ստուգեք ձեր գիտելիքները
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};
