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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  id: string;
  title: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

const CategoriesAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Category>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [newCategory, setNewCategory] = useState({
    title: "",
    description: "",
    image: ""
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "find",
        query: {}
      });
      return result as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return await queryMongoDB({
        collection: "questions_categories",
        operation: "insert",
        data: categoryData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories-count"] });
      toast.success("Category created successfully");
      setIsCreateDialogOpen(false);
      setNewCategory({ title: "", description: "", image: "" });
    },
    onError: (error) => {
      toast.error("Failed to create category");
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await queryMongoDB({
        collection: "questions_categories",
        operation: "update",
        query: { _id: id },
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await queryMongoDB({
        collection: "questions_categories",
        operation: "delete",
        query: { _id: id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories-count"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete category");
      console.error(error);
    }
  });

  const filteredAndSortedCategories = useMemo(() => {
    if (!categories) return [];
    
    let filtered = categories.filter(category =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort categories
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
  }, [categories, searchTerm, sortField, sortDirection]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCategories.slice(startIndex, endIndex);
  }, [filteredAndSortedCategories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCategories.length / itemsPerPage);

  const handleCreate = () => {
    if (!newCategory.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const categoryData = {
      ...newCategory,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    createMutation.mutate(categoryData);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCategory?.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const updateData = {
      ...editingCategory,
      updated_at: new Date().toISOString()
    };

    updateMutation.mutate({ id: editingCategory._id, data: updateData });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleViewQuestions = (category: Category) => {
    setSelectedCategory(category);
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-gray-600">
            Manage question categories
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                  placeholder="Category title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  placeholder="Image URL"
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

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Categories ({filteredAndSortedCategories.length})
              {filteredAndSortedCategories.length !== categories?.length && (
                <Badge variant="secondary" className="ml-2">
                  Filtered
                </Badge>
              )}
            </CardTitle>
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCategories.length)} of {filteredAndSortedCategories.length}
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
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
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
              {paginatedCategories.map((category) => (
                <TableRow key={category._id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{category.id}</TableCell>
                  <TableCell className="font-medium">{category.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuestions(category)}
                        title="View Questions"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Delete Category">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category._id)}
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
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editingCategory.image || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
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

      {/* Category Questions View Dialog */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Questions in: {selectedCategory?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryQuestionsView 
              category={selectedCategory} 
              onClose={() => setSelectedCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component to view questions for a specific category
const CategoryQuestionsView = ({ category, onClose }: { category: Category; onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["category-questions", category.id],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query: { category_id: category.id }
      });
      return result as any[];
    },
  });

  const paginatedQuestions = useMemo(() => {
    if (!questions) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return questions.slice(startIndex, endIndex);
  }, [questions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((questions?.length || 0) / itemsPerPage);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleQuestionSelect = (question: any) => {
    setSelectedQuestion(question);
  };

  return (
    <>
    <div className="space-y-4">
      {/* Category Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Category Details</h3>
        <div className="space-y-2">
          <p><strong>Title:</strong> {category.title}</p>
          <p><strong>Description:</strong> {category.description || "No description"}</p>
          {category.image && (
            <div>
              <strong>Image:</strong>
              <img src={category.image} alt={category.title} className="w-20 h-20 object-cover rounded mt-1" />
            </div>
          )}
        </div>
      </div>

      {/* Questions Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questions ({questions?.length || 0})</h3>
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

      {/* Questions List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedQuestions.map((question) => (
            <Card 
              key={question._id} 
              className={`border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
                selectedQuestion?._id === question._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleQuestionSelect(question)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{question.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={question.multiple_answers === "1" ? "secondary" : "default"}>
                        {question.multiple_answers === "1" ? "Multiple" : "Single"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuestionSelect(question);
                        }}
                        title="View Answers"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div dangerouslySetInnerHTML={{ __html: question.question }} />
                  </div>
                  {question.description && (
                    <p className="text-sm text-gray-500">{question.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {paginatedQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No questions found in this category.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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

      {/* Selected Question Answers View */}
    </div>
        {selectedQuestion && (
        <div
          className="absolute top-0 left-0 w-full bg-white border-t pt-6 z-50 max-h-[80vh] overflow-y-auto shadow-xl rounded-xl"
          style={{ position: "absolute" }}
        >
          <QuestionAnswersView
            question={selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
          />
        </div>
      )}
    </>
  );
};

// Component to view and manage answers for a specific question
const QuestionAnswersView = ({ question, onClose }: { question: any; onClose: () => void }) => {
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Selected Question</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
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

export default CategoriesAdmin;
