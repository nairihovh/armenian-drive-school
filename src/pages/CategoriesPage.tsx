import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useQuestions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Բեռնում...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ընտրեք կատեգորիան
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Սկսեք թեստավորումը՝ ընտրելով ցանկալի կատեգորիան
          </p>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-6 hover-scale card-elevated cursor-pointer group"
                onClick={() => navigate(`/test/${category.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name_hy}
                </h3>
                
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                )}
                
                <Button className="w-full btn-hero" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/test/${category.id}`);
                }}>
                  Սկսել թեստը
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Կատեգորիաներ դեռ չեն ավելացվել
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
