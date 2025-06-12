"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePostData } from "@/hooks/usePostData";
import { usePutData } from "@/hooks/usePutData";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useFetchData } from "@/hooks/useFetchData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


type QuestionFormValues = {
  CourseName: string;
  question: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  //   userQuestionStatus: "SOLVED" | "UNSOLVED";
  acceptancePercentage: number;
  topicName: string;
};


export default function QuestionForm({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void;
  initialData?: QuestionFormValues;
}) {

    const questionSchema = z.object({
  CourseName: z.string().min(1, "Please select a module"),
  topicName: z.string().min(1, "Please select a topic"),
  question: z.string().min(10, "Question must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  acceptancePercentage: z
    .number()
    .min(0, "Cannot be negative")
    .max(100, "Must be less than or equal to 100"),
});

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialData || {
      CourseName: "",

      question: "",
      difficulty: "EASY",
      //   userQuestionStatus: "UNSOLVED",
      acceptancePercentage: 0,
      topicName: "",
    },
  });

  const [selectedModule, setSelectedModule] = useState("");

  const {
    data: coursesData,
    isLoading,
    error,
  } = useFetchData("courses", "http://localhost:5001/api/admin/getCourses");

  if (coursesData) {
    console.log("coursescourses", coursesData);
  }

  const [updateapiUrl, setUpdateApiurl] = useState(null);

  const { mutate: createQuestionMutate } = usePostData(
    "http://localhost:5001/api/admin/createQuestion"
  );

  const { mutate: updateQuestion } = usePutData(updateapiUrl || "");

  const onSubmit = (data: QuestionFormValues) => {
    const isEdit = !!initialData?._id;
    const updateUrl = initialData?._id
      ? `http://localhost:5001/api/admin/updateQuestion/${initialData._id}`
      : null;

    setUpdateApiurl(updateUrl);

    if (isEdit && updateUrl) {
      // ✅ Remove _id to avoid MongoDB duplicate key error
      const { _id, ...cleanData } = data;

      updateQuestion(cleanData, {
        onSuccess: (response) => {
          console.log("Job updated:", response);
          onSuccess();
        },
        onError: (error: any) => {
          console.error("Update failed", error);
        },
      });
    } else {
      createQuestionMutate(data, {
        onSuccess: (response) => {
          console.log("Job created:", response);
          onSuccess();
        },
        onError: (error: any) => {
          console.error("Job creation failed", error);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <div className="w-full flex items-center justify-center p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xl space-y-5"
        >
          <FormField
            control={form.control}
            name="CourseName"
            render={({ field }) => {
              const allModules =
                coursesData?.flatMap((course: any) =>
                  course.modules?.map((mod: any) => ({
                    courseTitle: course.title,
                    moduleTitle: mod.title,
                  }))
                ) || [];

              return (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedModule(value); // Set selected module title
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a module" />
                      </SelectTrigger>
                      <SelectContent>
                        {allModules
                          .filter(
                            (item) =>
                              item?.moduleTitle && item?.moduleTitle.trim() !== ""
                          )
                          .map((item, index) => (
                            <SelectItem key={index} value={item?.moduleTitle}>
                              {item.moduleTitle}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="topicName"
            render={({ field }) => {
              const filteredTopics =
                coursesData?.flatMap((course: any) =>
                  course.modules
                    ?.filter((mod: any) => mod.title === selectedModule)
                    .flatMap((mod: any) =>
                      mod.topics
                        ?.filter(
                          (topic: any) =>
                            topic.title && topic.title.trim() !== ""
                        )
                        .map((topic: any) => ({
                          courseTitle: course.title,
                          moduleTitle: mod.title,
                          topicTitle: topic.title,
                        }))
                    )
                ) || [];

              return (
                <FormItem>
                  <FormLabel>Topic Name</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTopics.map((item, index) => (
                          <SelectItem key={index} value={item?.topicTitle}>
                            {item?.topicTitle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter question text"
                    {...field}
                    className="min-h-[100px]" // or use h-32, h-40 as needed
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptancePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acceptance Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 95.2"
                    {...field}
                    step="any"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white"  disabled={form.formState.isSubmitting}>
  {form.formState.isSubmitting ? "Submitting..." : "Create Question"}
</Button>

        </form>
      </div>
    </Form>
  );
}
