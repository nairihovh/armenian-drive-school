import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Clock, Trophy } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Ամբողջական ուսումնական նյութեր",
    description: "Ուսումնասիրեք ՀՀ ճանապարհային երթևեկության կանոններ"
  },
  {
    icon: Trophy,
    title: "Ավելի քան 2000 հարց",
    description: "Լայն շրջանակի թեստային հարցեր բոլոր կատեգորիաներից"
  },
  {
    icon: CheckCircle2,
    title: "Անմիջական արդյունքներ",
    description: "Տեսեք ձեր պատասխանների ճշտությունը իրական ժամանակում"
  },
  {
    icon: Clock,
    title: "Ազատ ժամանակացույց",
    description: "Սովորեք և թեստավորվեք ցանկացած ժամանակ, ցանկացած վայրում"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ինչու՞ ընտրել մեզ
          </h2>
          <p className="text-lg text-muted-foreground">
            Մենք տրամադրում ենք լավագույն գործիքները ձեր հաջողության համար
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 bg-card card-elevated">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
