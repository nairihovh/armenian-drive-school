import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryMongoDB } from "@/hooks/useMongoDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Upload, 
  Download, 
  FileText,
  Database,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const BulkOperations = () => {
  const [importData, setImportData] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"categories" | "questions" | "answers">("categories");

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-export"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions_categories",
        operation: "find",
        query: {}
      });
      return result;
    },
  });

  const { data: questions } = useQuery({
    queryKey: ["admin-questions-export"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "questions",
        operation: "find",
        query: {}
      });
      return result;
    },
  });

  const { data: answers } = useQuery({
    queryKey: ["admin-answers-export"],
    queryFn: async () => {
      const result = await queryMongoDB({
        collection: "answers",
        operation: "find",
        query: {}
      });
      return result;
    },
  });

  const importMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any[] }) => {
      const results = [];
      for (const item of data) {
        try {
          const result = await queryMongoDB({
            collection: type,
            operation: "insert",
            data: {
              ...item,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });
          results.push({ success: true, data: result });
        } catch (error) {
          results.push({ success: false, error: error.message });
        }
      }
      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: [`admin-${importType}`] });
        queryClient.invalidateQueries({ queryKey: [`admin-${importType}-count`] });
        toast.success(`Successfully imported ${successCount} items`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} items`);
      }
      
      setIsImportDialogOpen(false);
      setImportData("");
    },
    onError: (error) => {
      toast.error("Import failed");
      console.error(error);
    }
  });

  const handleExport = (type: "categories" | "questions" | "answers") => {
    let data: any[] = [];
    let filename = "";

    switch (type) {
      case "categories":
        data = categories || [];
        filename = "categories.json";
        break;
      case "questions":
        data = questions || [];
        filename = "questions.json";
        break;
      case "answers":
        data = answers || [];
        filename = "answers.json";
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${data.length} ${type} to ${filename}`);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      if (!Array.isArray(data)) {
        toast.error("Import data must be an array");
        return;
      }

      if (data.length === 0) {
        toast.error("No data to import");
        return;
      }

      importMutation.mutate({ type: importType, data });
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const getSampleData = (type: "categories" | "questions" | "answers") => {
    switch (type) {
      case "categories":
        return [
          {
            title: "Sample Category",
            description: "This is a sample category",
            image: "https://example.com/image.jpg"
          }
        ];
      case "questions":
        return [
          {
            category_id: "1",
            name: "Sample Question",
            question: "<p>This is a sample question?</p>",
            description: "Sample description",
            multiple_answers: "0"
          }
        ];
      case "answers":
        return [
          {
            question_id: "1",
            answer: "Sample answer",
            is_right: "1",
            sort: 1
          }
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="mt-2 text-gray-600">
          Import and export data in bulk
        </p>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Categories</Label>
              <Button 
                onClick={() => handleExport("categories")}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Categories
              </Button>
              <p className="text-sm text-gray-500">
                {categories?.length || 0} categories
              </p>
            </div>
            <div className="space-y-2">
              <Label>Questions</Label>
              <Button 
                onClick={() => handleExport("questions")}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Questions
              </Button>
              <p className="text-sm text-gray-500">
                {questions?.length || 0} questions
              </p>
            </div>
            <div className="space-y-2">
              <Label>Answers</Label>
              <Button 
                onClick={() => handleExport("answers")}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Answers
              </Button>
              <p className="text-sm text-gray-500">
                {answers?.length || 0} answers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Import Type</Label>
                <select 
                  value={importType}
                  onChange={(e) => setImportType(e.target.value as "categories" | "questions" | "answers")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="categories">Categories</option>
                  <option value="questions">Questions</option>
                  <option value="answers">Answers</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sample Format</Label>
                <Button 
                  onClick={() => setImportData(JSON.stringify(getSampleData(importType), null, 2))}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Load Sample
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Import</Label>
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Import {importType.charAt(0).toUpperCase() + importType.slice(1)}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="import-data">JSON Data</Label>
                        <Textarea
                          id="import-data"
                          value={importData}
                          onChange={(e) => setImportData(e.target.value)}
                          placeholder="Paste your JSON data here..."
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Import Warning
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <ul className="list-disc list-inside space-y-1">
                                <li>Data will be added to the database</li>
                                <li>Duplicate IDs will be automatically generated</li>
                                <li>Make sure your JSON format is correct</li>
                                <li>Backup your data before importing</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleImport} 
                          disabled={importMutation.isPending || !importData.trim()}
                        >
                          {importMutation.isPending ? "Importing..." : "Import"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Categories</TableCell>
                <TableCell>{categories?.length || 0}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Questions</TableCell>
                <TableCell>{questions?.length || 0}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Answers</TableCell>
                <TableCell>{answers?.length || 0}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
