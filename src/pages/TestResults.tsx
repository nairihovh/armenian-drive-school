import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";

export default function TestResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, correctAnswers, totalQuestions, timeSpent } = location.state || {};

  if (!score && score !== 0) {
    navigate("/");
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} րոպե ${secs} վայրկյան`;
  };

  const isPassed = score >= 80;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Result Card */}
          <Card className="p-8 md:p-12 text-center card-elevated mb-8">
            <div className="mb-8">
              {isPassed ? (
                <Trophy className="w-20 h-20 mx-auto text-green-500 mb-4" />
              ) : (
                <XCircle className="w-20 h-20 mx-auto text-destructive mb-4" />
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isPassed ? "Շնորհավորում ենք!" : "Փորձեք նորից"}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {isPassed
                  ? "Դուք հաջողությամբ անցել եք թեստը"
                  : "Դուք չեք անցել թեստը այս անգամ"}
              </p>
            </div>

            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                  className={isPassed ? "text-green-500" : "text-destructive"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{score}%</div>
                  <div className="text-sm text-muted-foreground">Գնահատական</div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Ճիշտ պատասխաններ</div>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <div className="text-2xl font-bold">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Սխալ պատասխաններ</div>
              </div>
              
              <div className="p-4 bg-secondary/50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Ժամանակ</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Անցման շեմ՝ 80%</span>
                <span className="font-semibold">Ձեր արդյունք՝ {score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Փորձել նորից
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto btn-hero"
              >
                Վերադառնալ գլխավոր
              </Button>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="p-6 bg-primary/5">
            <h3 className="font-semibold text-lg mb-3">💡 Խորհուրդներ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Անցման համար անհրաժեշտ է 80% և ավելի</li>
              <li>• Ուշադիր կարդացեք բոլոր հարցերը</li>
              <li>• Օգտվեք ուսումնական նյութերից</li>
              <li>• Փորձեք կատարել ավելի շատ թեստեր</li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
