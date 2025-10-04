import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRandomQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TestPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { data: questions, isLoading } = useRandomQuestions(categoryId || "", 20);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Բեռնում...</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Հարցեր չեն գտնվել</h1>
          <Button onClick={() => navigate("/")}>Վերադառնալ գլխավոր</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion._id]: answerId,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    const correctAnswers = questions.filter((q) => {
      const selectedAnswerId = selectedAnswers[q._id];
      const correctAnswer = q.answers.find((a) => a.is_correct);
      return selectedAnswerId === correctAnswer?._id;
    }).length;

    const score = Math.round((correctAnswers / questions.length) * 100);

    navigate("/test-results", {
      state: {
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
      },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Հարց {currentQuestionIndex + 1} / {questions.length}
            </h1>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              {formatTime(timeSpent)}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-6 md:p-8 mb-8 card-elevated">
          {currentQuestion.question_image && (
            <img
              src={currentQuestion.question_image}
              alt="Question"
              className="w-full max-w-md mx-auto mb-6 rounded-lg"
            />
          )}
          
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            {currentQuestion.question_text_hy}
          </h2>

          <RadioGroup
            value={selectedAnswers[currentQuestion._id] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {currentQuestion.answers
              .sort((a, b) => a.order_index - b.order_index)
              .map((answer) => (
                <div
                  key={answer._id}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={answer._id} id={answer._id} />
                  <Label
                    htmlFor={answer._id}
                    className="flex-1 cursor-pointer text-base md:text-lg"
                  >
                    {answer.answer_text_hy}
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto"
          >
            Նախորդ
          </Button>

          <div className="flex gap-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className="w-full sm:w-auto btn-hero"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Ավարտել թեստը
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto btn-hero"
              >
                Հաջորդ
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                selectedAnswers[q._id]
                  ? "bg-primary text-primary-foreground"
                  : index === currentQuestionIndex
                  ? "bg-accent text-accent-foreground ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
