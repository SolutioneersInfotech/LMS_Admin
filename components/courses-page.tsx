"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Rocket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Upload,
  Video,
  LinkIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import EditCourseModal from "../components/EditCourseModal";
import { usePostData } from "@/hooks/usePostData";
import { useFetchData } from "@/hooks/useFetchData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePutData } from "@/hooks/usePutData";
import { useDeleteData } from "@/hooks/useDeleteData";

const courses = [
  {
    id: 1,
    thumbnail: "/placeholder.svg?height=60&width=80",
    title: "React Fundamentals",
    category: "Web Development",
    instructor: "Sarah Johnson",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    status: "Published",
    progress: 85,
    students: 234,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    thumbnail: "/placeholder.svg?height=60&width=80",
    title: "Advanced JavaScript",
    category: "Programming",
    instructor: "Mike Chen",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    status: "Draft",
    progress: 60,
    students: 0,
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    thumbnail: "/placeholder.svg?height=60&width=80",
    title: "Python for Data Science",
    category: "Data Science",
    instructor: "Dr. Emily Rodriguez",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    status: "Published",
    progress: 92,
    students: 156,
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    thumbnail: "/placeholder.svg?height=60&width=80",
    title: "UI/UX Design Principles",
    category: "Design",
    instructor: "Alex Thompson",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    status: "Published",
    progress: 78,
    students: 89,
    createdAt: "2024-01-25",
  },
];

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState<number | null>(null);
  const [ courseIdToDelete , setCourseIdToDelete] = React.useState<number | null>(null);
  const [ courseIdToPublish , setCourseIdToPublish ] = React.useState<number | null>(null);
  const [editingCourse, setEditingCourse] = React.useState({
    id: "",
    title: "",
    description: "",
    category: "",
  });

  const [newcourse, setNewCourse] = React.useState({
    title: "",
    description: "",
    category: "",
  });

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const {
    data: coursesData,
    isLoading,
    error,
  } = useFetchData("courses", "http://localhost:5001/api/getCourses");

  if (coursesData) {
    console.log("coursescourses", coursesData);
  }

  const filteredCourses = coursesData?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChange = (field: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [field]: value }));
  };

  const { mutate } = usePostData("http://localhost:5001/api/createCourse");

  const handleCreate = () => {
    console.log("handleCreate");

    const { title, description, category } = newcourse;
    if (!title || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    console.log("newce", newcourse);

    mutate(newcourse, {
      onSuccess: (data) => {
        console.log("Course created:", data);
        setNewCourse({ title: "", description: "", category: "" });
        queryClient.invalidateQueries(["courses"]);
        // optionally close modal or refresh list here
        setShowCreateModal(false);
      },
      onError: (error: any) => {
        console.error("Course creation failed", error);
        alert("Failed to create course");
      },
    });
  };

  const handleViewDetails = (courseId: number) => {
    console.log("View details for course:", courseId);
    // Add your view details logic here
  };

     const publishMutation =  usePutData(`http://localhost:5001/api/publishCourse/${courseIdToPublish}`);


  const handlePublishCourse = (courseId: number) =>{
    setCourseIdToPublish(courseId)
   publishMutation.mutate();
  }

  const { mutate: updateCourseMutate } = usePutData(
  selectedCourseId ? `http://localhost:5001/api/updateCourse/${selectedCourseId}` : ''
);


  const handleEditCourse = (courseId: number) => {
    console.log("courseIdcourseId", courseId);
    console.log("courseIdcourseId type ", typeof courseId);
    const course = coursesData?.find((c) => c._id == courseId);

    console.log("vsgvgvjgsvjv", course);
    if (course) {
      // Mock course data with modules structure
      const courseWithModules = {
        ...course,
      };
      setSelectedCourseId(courseId)
      setEditingCourse(courseWithModules);
      setShowEditModal(true);
    }
  };

  queryClient.invalidateQueries(["courses"]);

  const {
    mutate: deleteCourse,
    isPending,
    isSuccess,
  } = useDeleteData(`http://localhost:5001/api/deleteCourse/${courseIdToDelete}`)

  const handleDeleteCourse = (courseId: number) => {
    console.log("Delete course Id:", courseId);
    setCourseIdToDelete(courseId);
    deleteCourse()
     queryClient.invalidateQueries(["courses"]);
    // Add your delete course logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-2">
            Manage all courses and learning content
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search courses, instructors, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="border-slate-200"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Course
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Category
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Instructor
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Progress
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Students
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses?.map((course) => (
              <TableRow
                key={course._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={course.thumbnail_image || "/placeholder.svg"}
                      alt={course.title}
                      className="h-12 w-16 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <div className="font-medium text-slate-900">
                        {course.title}
                      </div>
                      {/* <div className="text-sm text-slate-500">Created {course.createdAt}</div> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {course.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={course.instructorAvatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        {course?.instructor
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-900">
                      {course.instructor}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "Published" ? "default" : "secondary"
                    }
                    className={
                      course.status === "Published"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Completion</span>
                      <span className="font-medium text-slate-900">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900">
                      {course.students}
                    </div>
                    <div className="text-xs text-slate-500">enrolled</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handlePublishCourse(course._id)}
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        Publish Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(course._id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditCourse(course._id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Showing {filteredCourses?.length} of {coursesData?.length} courses
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Course</h3>

            <div className="space-y-4">
              <Input
                placeholder="Course Title"
                value={newcourse.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                placeholder="Course Description"
                value={newcourse.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <Select
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={handleCreate}
              >
                Create Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* More Filters Panel */}
      {showMoreFilters && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="emily">Dr. Emily Rodriguez</SelectItem>
                <SelectItem value="alex">Alex Thompson</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMoreFilters(false)}>
              Clear Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => {
            setShowEditModal(false);
            setEditingCourse(null);
          }}
          onSave={(updatedCourse) => {
            console.log("Saving course:", updatedCourse);
            updateCourseMutate(updatedCourse);

            toast({
              title: "Course Updated",
              description: `"${updatedCourse.title}" has been successfully updated.`,
            });
            setShowEditModal(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
}
