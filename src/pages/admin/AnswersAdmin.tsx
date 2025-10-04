import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryMongoDB } from "@/hooks/useMongoDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Answer {
  _id: string;
  id: string;
  question_id: string;
  answer: string;
  is_right: string;
  sort: number;
  created_at?: string;
  updated_at?: string;
}

interface Question {
  _id: string;
  id: string;
  name: string;
  category_id: string;
}

const AnswersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Answer>("sort");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newAnswer, setNewAnswer] = useState({
    question_id: "",
    answer: "",
    is_right: "0",
    sort: 1
  });

  const queryClient = useQueryClient();

  const { data: questions } = useQuery({
    queryKey: ["admin-questions-for-answers"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query: {}
      });
      return result as Question[];
    },
  });

  const { data: answers, isLoading } = useQuery({
    queryKey: ["admin-answers"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "answers",
        operation: "find",
        query: {}
      });
      return result as Answer[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (answerData: any) => {
      return await queryMongoDB({
        collection: "answers",
        operation: "insert",
        data: answerData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-answers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-answers-count"] });
      toast.success("Answer created successfully");
      setIsCreateDialogOpen(false);
      setNewAnswer({ question_id: "", answer: "", is_right: "0", sort: 1 });
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
      queryClient.invalidateQueries({ queryKey: ["admin-answers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-answers-count"] });
      toast.success("Answer deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete answer");
      console.error(error);
    }
  });

  const filteredAndSortedAnswers = useMemo(() => {
    if (!answers) return [];
    
    let filtered = answers.filter(answer => {
      const matchesSearch = answer.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuestion = selectedQuestion === "all" || answer.question_id === selectedQuestion;
      return matchesSearch && matchesQuestion;
    });

    // Sort answers
    filtered.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      
      if (sortField === "sort") {
        const aNum = parseInt(aValue.toString()) || 0;
        const bNum = parseInt(bValue.toString()) || 0;
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [answers, searchTerm, selectedQuestion, sortField, sortDirection]);

  const paginatedAnswers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAnswers.slice(startIndex, endIndex);
  }, [filteredAndSortedAnswers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedAnswers.length / itemsPerPage);

  const getQuestionName = (questionId: string) => {
    const question = questions?.find(q => q.id === questionId);
    return question?.name || "Unknown Question";
  };

  const handleCreate = () => {
    if (!newAnswer.question_id || !newAnswer.answer.trim()) {
      toast.error("Question and answer are required");
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

  const handleEdit = (answer: Answer) => {
    setEditingAnswer(answer);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAnswer?.question_id || !editingAnswer?.answer.trim()) {
      toast.error("Question and answer are required");
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

  const handleSort = (field: keyof Answer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
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
          <h1 className="text-3xl font-bold text-gray-900">Answers</h1>
          <p className="mt-2 text-gray-600">
            Manage question answers
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Answer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Answer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Select value={newAnswer.question_id} onValueChange={(value) => setNewAnswer({ ...newAnswer, question_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question" />
                  </SelectTrigger>
                  <SelectContent>
                    {questions?.map((question) => (
                      <SelectItem key={question.id} value={question.id}>
                        {question.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={newAnswer.answer}
                  onChange={(e) => setNewAnswer({ ...newAnswer, answer: e.target.value })}
                  placeholder="Answer text"
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
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by question" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              {questions?.map((question) => (
                <SelectItem key={question.id} value={question.id}>
                  {question.name}
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

      {/* Answers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Answers ({filteredAndSortedAnswers.length})
              {filteredAndSortedAnswers.length !== answers?.length && (
                <Badge variant="secondary" className="ml-2">
                  Filtered
                </Badge>
              )}
            </CardTitle>
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedAnswers.length)} of {filteredAndSortedAnswers.length}
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
                  onClick={() => handleSort("question_id")}
                >
                  <div className="flex items-center gap-2">
                    Question
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("answer")}
                >
                  <div className="flex items-center gap-2">
                    Answer
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("is_right")}
                >
                  <div className="flex items-center gap-2">
                    Correct
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("sort")}
                >
                  <div className="flex items-center gap-2">
                    Sort
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnswers.map((answer) => (
                <TableRow key={answer._id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{answer.id}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={getQuestionName(answer.question_id)}>
                      {getQuestionName(answer.question_id)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={answer.answer}>
                      {answer.answer}
                    </div>
                  </TableCell>
                  <TableCell>
                    {answer.is_right === "1" ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{answer.sort}</TableCell>
                  <TableCell>
                    {answer.created_at ? new Date(answer.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(answer)}
                        title="Edit Answer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Delete Answer">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Answer</DialogTitle>
          </DialogHeader>
          {editingAnswer && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-question">Question</Label>
                <Select value={editingAnswer.question_id} onValueChange={(value) => setEditingAnswer({ ...editingAnswer, question_id: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questions?.map((question) => (
                      <SelectItem key={question.id} value={question.id}>
                        {question.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-answer">Answer</Label>
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

export default AnswersAdmin;
