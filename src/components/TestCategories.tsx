import { CategoryCard } from "./CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { Loader2, Shield, AlertTriangle, Construction, Gauge, MapPin, Siren, SignalHigh, Car } from "lucide-react";

const iconMap: Record<string, any> = {
  Shield,
  AlertTriangle,
  Construction,
  Gauge,
  MapPin,
  Siren,
  SignalHigh,
  Car
};

const defaultColors = [
  "bg-primary",
  "bg-accent",
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-red-600",
  "bg-yellow-600",
  "bg-gray-600"
];


export const TestCategories = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section id="tests" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Բեռնվում է...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tests" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Սխալ է տեղի ունեցել տվյալների բեռնման ժամանակ</p>
        </div>
      </section>
    );
  }

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
          {categories?.map((category, index) => {
            const IconComponent = category.icon && iconMap[category.icon] 
              ? iconMap[category.icon] 
              : Shield;
            const color = defaultColors[index % defaultColors.length];
            
            return (
              <CategoryCard 
                key={category.id}
                title={category.name_hy}
                description={category.description || "Ուսումնասիրեք այս կատեգորիայի հարցերը"}
                questionCount={0}
                icon={IconComponent}
                color={color}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
