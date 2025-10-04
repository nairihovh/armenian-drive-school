import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryMongoDB } from "@/hooks/useMongoDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  _id: string;
  id: string;
  category_id: string;
  name: string;
  question: string;
  description?: string;
  multiple_answers?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  _id: string;
  id: string;
  title: string;
}

const QuestionsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Question>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [newQuestion, setNewQuestion] = useState({
    category_id: "",
    name: "",
    question: "",
    description: "",
    multiple_answers: "0"
  });

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-for-questions"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "find",
        query: {}
      });
      return result as Category[];
    },
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query: {}
      });
      return result as Question[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (questionData: any) => {
      return await queryMongoDB({
        collection: "questions",
        operation: "insert",
        data: questionData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-questions-count"] });
      toast.success("Question created successfully");
      setIsCreateDialogOpen(false);
      setNewQuestion({ category_id: "", name: "", question: "", description: "", multiple_answers: "0" });
    },
    onError: (error) => {
      toast.error("Failed to create question");
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await queryMongoDB({
        collection: "questions",
        operation: "update",
        query: { _id: id },
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      toast.success("Question updated successfully");
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
    },
    onError: (error) => {
      toast.error("Failed to update question");
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await queryMongoDB({
        collection: "questions",
        operation: "delete",
        query: { _id: id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-questions-count"] });
      toast.success("Question deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete question");
      console.error(error);
    }
  });

  const filteredAndSortedQuestions = useMemo(() => {
    if (!questions) return [];
    
    let filtered = questions.filter(question => {
      const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.question.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || question.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort questions
    filtered.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [questions, searchTerm, selectedCategory, sortField, sortDirection]);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedQuestions.slice(startIndex, endIndex);
  }, [filteredAndSortedQuestions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedQuestions.length / itemsPerPage);

  const getCategoryTitle = (categoryId: string) => {
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.title || "Unknown Category";
  };

  const handleCreate = () => {
    if (!newQuestion.category_id || !newQuestion.name.trim() || !newQuestion.question.trim()) {
      toast.error("Category, name, and question are required");
      return;
    }

    const questionData = {
      ...newQuestion,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    createMutation.mutate(questionData);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingQuestion?.category_id || !editingQuestion?.name.trim() || !editingQuestion?.question.trim()) {
      toast.error("Category, name, and question are required");
      return;
    }

    const updateData = {
      ...editingQuestion,
      updated_at: new Date().toISOString()
    };

    updateMutation.mutate({ id: editingQuestion._id, data: updateData });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSort = (field: keyof Question) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleViewAnswers = (question: Question) => {
    setSelectedQuestion(question);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="mt-2 text-gray-600">
            Manage test questions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newQuestion.category_id} onValueChange={(value) => setNewQuestion({ ...newQuestion, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newQuestion.name}
                  onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                  placeholder="Question name"
                />
              </div>
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Question text (HTML supported)"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                  placeholder="Question description"
                />
              </div>
              <div>
                <Label htmlFor="multiple_answers">Multiple Answers</Label>
                <Select value={newQuestion.multiple_answers} onValueChange={(value) => setNewQuestion({ ...newQuestion, multiple_answers: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Single Answer</SelectItem>
                    <SelectItem value="1">Multiple Answers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Questions ({filteredAndSortedQuestions.length})
              {filteredAndSortedQuestions.length !== questions?.length && (
                <Badge variant="secondary" className="ml-2">
                  Filtered
                </Badge>
              )}
            </CardTitle>
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedQuestions.length)} of {filteredAndSortedQuestions.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("category_id")}
                >
                  <div className="flex items-center gap-2">
                    Category
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Multiple</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuestions.map((question) => (
                <TableRow key={question._id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{question.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryTitle(question.category_id)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{question.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={stripHtml(question.question)}>
                      {stripHtml(question.question)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {question.multiple_answers === "1" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Multiple
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Single
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {question.created_at ? new Date(question.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAnswers(question)}
                        title="View Answers"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        title="Edit Question"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Delete Question">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{question.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(question._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editingQuestion.category_id} onValueChange={(value) => setEditingQuestion({ ...editingQuestion, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingQuestion.name}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-question">Question</Label>
                <Textarea
                  id="edit-question"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingQuestion.description || ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-multiple">Multiple Answers</Label>
                <Select value={editingQuestion.multiple_answers || "0"} onValueChange={(value) => setEditingQuestion({ ...editingQuestion, multiple_answers: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Single Answer</SelectItem>
                    <SelectItem value="1">Multiple Answers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Answers View Dialog */}
      <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Answers for: {selectedQuestion?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <QuestionAnswersView 
              question={selectedQuestion} 
              onClose={() => setSelectedQuestion(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component to view and manage answers for a specific question
const QuestionAnswersView = ({ question, onClose }: { question: Question; onClose: () => void }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<any>(null);
  const [newAnswer, setNewAnswer] = useState({
    answer: "",
    is_right: "0",
    sort: 1
  });

  const queryClient = useQueryClient();

  const { data: answers, isLoading } = useQuery({
    queryKey: ["question-answers", question.id],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "answers",
        operation: "find",
        query: { question_id: question.id }
      });
      return result as any[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (answerData: any) => {
      return await queryMongoDB({
        collection: "answers",
        operation: "insert",
        data: { ...answerData, question_id: question.id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-answers", question.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-answers"] });
      toast.success("Answer created successfully");
      setIsCreateDialogOpen(false);
      setNewAnswer({ answer: "", is_right: "0", sort: 1 });
    },
    onError: (error) => {
      toast.error("Failed to create answer");
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await queryMongoDB({
        collection: "answers",
        operation: "update",
        query: { _id: id },
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-answers", question.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-answers"] });
      toast.success("Answer updated successfully");
      setIsEditDialogOpen(false);
      setEditingAnswer(null);
    },
    onError: (error) => {
      toast.error("Failed to update answer");
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await queryMongoDB({
        collection: "answers",
        operation: "delete",
        query: { _id: id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-answers", question.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-answers"] });
      toast.success("Answer deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete answer");
      console.error(error);
    }
  });

  const handleCreate = () => {
    if (!newAnswer.answer.trim()) {
      toast.error("Answer text is required");
      return;
    }

    const answerData = {
      ...newAnswer,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    createMutation.mutate(answerData);
  };

  const handleEdit = (answer: any) => {
    setEditingAnswer(answer);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAnswer?.answer.trim()) {
      toast.error("Answer text is required");
      return;
    }

    const updateData = {
      ...editingAnswer,
      updated_at: new Date().toISOString()
    };

    updateMutation.mutate({ id: editingAnswer._id, data: updateData });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const sortedAnswers = answers?.sort((a, b) => a.sort - b.sort) || [];

  return (
    <div className="space-y-4">
      {/* Question Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Question Details</h3>
        <div className="space-y-2">
          <p><strong>Name:</strong> {question.name}</p>
          <p><strong>Type:</strong> {question.multiple_answers === "1" ? "Multiple Answers" : "Single Answer"}</p>
          <div>
            <strong>Question Text:</strong>
            <div className="mt-1 p-2 bg-white rounded border" dangerouslySetInnerHTML={{ __html: question.question }} />
          </div>
        </div>
      </div>

      {/* Answers Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Answers ({sortedAnswers.length})</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Answer
        </Button>
      </div>

      {/* Answers List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAnswers.map((answer) => (
            <Card key={answer._id} className={`${answer.is_right === "1" ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={answer.is_right === "1" ? "default" : "secondary"}>
                        {answer.is_right === "1" ? "Correct" : "Incorrect"}
                      </Badge>
                      <span className="text-sm text-gray-500">Sort: {answer.sort}</span>
                    </div>
                    <p className="text-gray-900">{answer.answer}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(answer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Answer</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this answer? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(answer._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sortedAnswers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No answers found for this question. Add some answers to get started.
            </div>
          )}
        </div>
      )}

      {/* Create Answer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Answer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="answer">Answer Text</Label>
              <Textarea
                id="answer"
                value={newAnswer.answer}
                onChange={(e) => setNewAnswer({ ...newAnswer, answer: e.target.value })}
                placeholder="Enter the answer text"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_right"
                checked={newAnswer.is_right === "1"}
                onCheckedChange={(checked) => setNewAnswer({ ...newAnswer, is_right: checked ? "1" : "0" })}
              />
              <Label htmlFor="is_right">Correct Answer</Label>
            </div>
            <div>
              <Label htmlFor="sort">Sort Order</Label>
              <Input
                id="sort"
                type="number"
                value={newAnswer.sort}
                onChange={(e) => setNewAnswer({ ...newAnswer, sort: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Answer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Answer</DialogTitle>
          </DialogHeader>
          {editingAnswer && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-answer">Answer Text</Label>
                <Textarea
                  id="edit-answer"
                  value={editingAnswer.answer}
                  onChange={(e) => setEditingAnswer({ ...editingAnswer, answer: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is_right"
                  checked={editingAnswer.is_right === "1"}
                  onCheckedChange={(checked) => setEditingAnswer({ ...editingAnswer, is_right: checked ? "1" : "0" })}
                />
                <Label htmlFor="edit-is_right">Correct Answer</Label>
              </div>
              <div>
                <Label htmlFor="edit-sort">Sort Order</Label>
                <Input
                  id="edit-sort"
                  type="number"
                  value={editingAnswer.sort}
                  onChange={(e) => setEditingAnswer({ ...editingAnswer, sort: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsAdmin;
