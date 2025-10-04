import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  questionCount: number;
  icon: LucideIcon;
  color: string;
  categoryId?: string;
}

export const CategoryCard = ({ 
  title, 
  description, 
  questionCount, 
  icon: Icon,
  color,
  categoryId
}: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (categoryId) {
      navigate(`/test/${categoryId}`);
    }
  };

  return (
    <Card 
      className="card-elevated group cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <CardHeader>
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {questionCount} հարց
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="group-hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Սկսել
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
