-- Create questions_categories table
CREATE TABLE public.questions_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hy TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.questions_categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_text_hy TEXT NOT NULL,
  question_image TEXT,
  explanation TEXT,
  explanation_hy TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create answers table
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  answer_text_hy TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hy TEXT NOT NULL,
  description TEXT,
  description_hy TEXT,
  category_id UUID REFERENCES public.questions_categories(id) ON DELETE SET NULL,
  time_limit_minutes INTEGER,
  passing_score INTEGER DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_configurations table
CREATE TABLE public.exam_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hy TEXT NOT NULL,
  description TEXT,
  total_questions INTEGER NOT NULL,
  time_limit_minutes INTEGER,
  passing_score INTEGER DEFAULT 80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_configuration_items table
CREATE TABLE public.exam_configuration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_config_id UUID REFERENCES public.exam_configurations(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.questions_categories(id) ON DELETE CASCADE NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user test attempts table
CREATE TABLE public.user_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  exam_config_id UUID REFERENCES public.exam_configurations(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  correct_answers INTEGER,
  time_spent_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_hy TEXT NOT NULL,
  content TEXT,
  content_hy TEXT,
  meta_description TEXT,
  meta_description_hy TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menus table
CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hy TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hy TEXT NOT NULL,
  description TEXT,
  description_hy TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'pdf', 'article', 'image', 'link')),
  resource_url TEXT NOT NULL,
  category_id UUID REFERENCES public.questions_categories(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_configuration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view active categories" ON public.questions_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active questions" ON public.questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view answers" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Public can view active tests" ON public.tests FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active exam configs" ON public.exam_configurations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view exam config items" ON public.exam_configuration_items FOR SELECT USING (true);
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active menus" ON public.menus FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active resources" ON public.resources FOR SELECT USING (is_active = true);

-- RLS Policies for user test attempts
CREATE POLICY "Users can view own attempts" ON public.user_test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own attempts" ON public.user_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON public.user_test_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_questions_category ON public.questions(category_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);
CREATE INDEX idx_user_attempts_user ON public.user_test_attempts(user_id);
CREATE INDEX idx_exam_config_items_config ON public.exam_configuration_items(exam_config_id);
CREATE INDEX idx_resources_category ON public.resources(category_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_questions_categories_updated_at BEFORE UPDATE ON public.questions_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exam_configurations_updated_at BEFORE UPDATE ON public.exam_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();