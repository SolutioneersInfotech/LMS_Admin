import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFetchData } from "@/hooks/useFetchData";
import QuestionForm from "./QuestionForm";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useDeleteData } from "@/hooks/useDeleteData";

const QuestionBank = () => {
  const [questions, setQuestions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questionIDToDelete, setQuestionIDToDelete] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useFetchData(
    "allQuestions",
    "http://localhost:5001/api/getAllQuestions"
  );
  useEffect(() => {
    if (data) {
      setQuestions(data?.allQuestions);
    }
  }, [data]);

  const handleCreateQuestion = () => {
    setShowModal(true);
  };

  const handleUpdate = (question) => {
    console.log("question", question);
    setEditingQuestion(question);
    setShowModal(true);
  };

  const { mutate: deleteMutate } = useDeleteData(
    `http://localhost:5001/api/admin/deleteQuestion/${questionIDToDelete}`
  );

  const handleDelete = (questionId) => {
    console.log("questionId", questionId);
    setQuestionIDToDelete(questionId);
    deleteMutate();
  };

  queryClient.invalidateQueries(["allQuestions"]);

  return (
    <div>
      <div className="min-h-screen ">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6 text-center">Question Bank</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateQuestion}
          >
            <Plus className="h-4 w-2 mr-2" />
            Post Question
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions?.map((q) => (
            <Card key={q._id} className="bg-white border shadow-md relative">
              {/* Three Dots Menu */}
              <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdate(q)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(q._id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Card Content */}
              <CardHeader>
                <CardTitle className="text-gray-800 text-4xl my-2">{q.CourseName}</CardTitle>
                <CardTitle>{q.topicName}</CardTitle>
                <CardDescription>
                  {(() => {
                    const date = new Date(q.createdAt);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = date.toLocaleString("en-US", {
                      month: "short",
                    });
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");

                    return `${day} - ${month} - ${year} / ${hours}:${minutes}`;
                  })()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 mb-4">{q.question}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Difficulty: {q.difficulty}</Badge>
                  <Badge variant="outline">
                    Acceptance: {q.acceptancePercentage}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setEditingQuestion(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-hidden p-0">
          <div className="sticky top-0  bg-white p-4 border-b">
            <DialogHeader>
              <DialogTitle>Post Question</DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Body */}
          <div
            className="overflow-y-auto max-h-[calc(90vh-72px)]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <QuestionForm
              key={editingQuestion?._id || "create"}
              onSuccess={() => {
                setShowModal(false);
                setEditingQuestion(null);
                queryClient.invalidateQueries(["allQuestions"]);
              }}
              initialData={editingQuestion}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBank;
