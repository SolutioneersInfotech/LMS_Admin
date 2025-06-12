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
  Play,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import ReactPlayer from "react-player";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePostData } from "@/hooks/usePostData";
import { usePostFormData } from "@/hooks/usePostFormData";
import { useFetchData } from "@/hooks/useFetchData";
import { usePutData } from "@/hooks/usePutData";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/lib/utils";
import HLSVideoPlayer from "./VideoPlayer";
import { useDeleteData } from "@/hooks/useDeleteData";
import JobPostForm from "./jobPost-page";
import VideoPlayer from "./VideoPlayer";

export function LecturesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showMoreFilters, setShowMoreFilters] = React.useState(false);
  const [selectedLecture, setSelectedLecture] = React.useState(null);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const { toast } = useToast();
  const [bonusCourses, setBonusCourses] = React.useState(null);
  const [publisheLecture, setPublishLecture] = React.useState(null);
  const [selectedVideoData, setSelectedVideoData] = React.useState<{
    videoId: string;
    otp: string;
    playbackInfo: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [lectureIdToDelete, setLectureIdToDelete] = React.useState(null);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    instructorName: "",
    // duration: "",
    status: "Published",
    thumbnail_image: "",
    videoUrl: null as File | null,
  });

  React.useEffect(() => {
    if (selectedLecture) {
      setFormData({
        title: selectedLecture.title || "",
        description: selectedLecture.description || "",
        instructorName: selectedLecture.instructorName || "",
        // duration: selectedLecture.duration || "",
        status: selectedLecture.status || "Published",
        thumbnail_image: selectedLecture.thumbnail_image || "",
        videoUrl: selectedLecture.videoUrl || "",
      });
    }
  }, [selectedLecture]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const thumbnailRef = React.useRef(null);

  const changeThubnailImage = (e) => {
    thumbnailRef?.current?.click();
  };

  // const vidRef = React.useRef(null);

  const handleThumbnailEdit = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("handleThumbnailEdithandleThumbnailEdit");
    const file = e.target.files?.[0];
    if (file) {
      console.log("file exist", file);
      const thumbnail_image = await uploadToCloudinary(file);
      console.log("thumbnail_image", thumbnail_image);
      if (thumbnail_image) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_image,
        }));
      }
    }

    // const selectTutorialVideo = ()=>{
    //   vidRef?.current?.click();
    // }

    // const handleTutorialChange = (e)=>{
    //   const file = e.target.files?.[0];
    //   if (file){
    //     setFormData((prev)=>({
    //     ...prev , file
    //   }))
    //   }

    // }
  };

const { mutate : editBonusCourseMutate } = usePostFormData(
    `https://lms-backend-three-sandy.vercel.app/api/admin/editBonusCourse/${selectedLecture?._id}`
  );

  const handleSubmit = () => {
    // handleEditLectureSubmit(formData)
    console.log("formData in handleSubmit", formData);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("instructorName", formData.instructorName);
    data.append("status", formData.status);
    data.append("thumbnail_image", formData.thumbnail_image);

    // Only append if file exists
    if (formData.videoUrl instanceof File) {
      data.append("video", formData.videoUrl); // ✅ safe
    } else if (formData.videoUrl && formData.videoUrl.file instanceof File) {
      data.append("video", formData.videoUrl.file); // ✅ handle nested case
    } else {
      console.warn("Invalid video file. Not appending.");
    }

    editBonusCourseMutate(data);

    setShowViewModal(false);
  };

  const queryClient = useQueryClient();

  const filteredLectures = bonusCourses?.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lecture.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { data, isLoading, error } = useFetchData(
    "bonus_courses",
    "https://lms-backend-three-sandy.vercel.app/api/getallBonusCourses"
  );

  React.useEffect(() => {
    if (data) {
      setBonusCourses(data.allBonusCourses);
    }
  }, [data]);

  const { mutate } = usePostFormData(
    "https://lms-backend-three-sandy.vercel.app/api/admin/createBonusCourse"
  );

  const handleCreateLecture = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const instructorName = formData.get("instructorName") as string;
    const description = formData.get("description") as string;
    const video = formData.get("video") as File;
    const thumbnail_images = formData.get("thumbnail_image") as File;

    const thumbnail_image = await uploadToCloudinary(thumbnail_images);
    if (!thumbnail_image) return;

    const newFormData = new FormData(); // ✅ Correct!
    newFormData.append("title", title);
    newFormData.append("instructorName", instructorName);
    newFormData.append("description", description);
    newFormData.append("video", video);
    newFormData.append("thumbnail_image", thumbnail_image);

    console.log("newFormDatanewFormDatanewFormData", newFormData);

    mutate(newFormData); // pass FormData, not JSON

    toast({
      title: "Lecture Created",
      description: `"${title}" has been successfully created.`,
    });
    setShowCreateModal(false);
  };

  const handleViewDetails = (lecture: (typeof lectures)[0]) => {
    console.log("jgghcghcghcghchgchg", lecture);
    setSelectedLecture(lecture);
    setShowViewModal(true);
  };

  const handleEditLecture = (lectureId: number) => {
    console.log("Edit lecture:", lectureId);
    toast({
      title: "Edit Lecture",
      description: "Opening lecture editor...",
    });
  };

  const {
    mutate: deleteBonusCourse,
    isPending,
    isSuccess,
  } = useDeleteData(
    `https://lms-backend-three-sandy.vercel.app/api/admin/deleteBonusCourse/${lectureIdToDelete}`
  );

  const handleDeleteLecture = (lectureId: number) => {
    console.log("Delete lecture:", lectureId);
    setLectureIdToDelete(lectureId);

    deleteBonusCourse();
    // toast({
    //   title: "Lecture Deleted",
    //   description: "The lecture has been successfully deleted.",
    //   variant: "destructive",
    // });
  };

  const publishMutation = usePutData(
    `https://lms-backend-three-sandy.vercel.app/api/admin/publishBonusCourse/${publisheLecture}`
  );

  queryClient.invalidateQueries(["bonus_courses"]);

  const handlePublishLecture = (lectureId: number) => {
    setPublishLecture(lectureId);
    publishMutation.mutate();
    toast({
      title: "Lecture Published",
      description: "The lecture is now live and available to students.",
    });
  };

  const vidRef = React.useRef(null);

  const selectTutorialVideo = () => {
    vidRef?.current?.click();
  };

  const handleTutorialChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: file,
        }));
      }
    }
  };

  const handleSelectedVideo = async (lectureVideoUrl) => {
    const res = await fetch(
      `http://localhost:5001/api/vdocipher/otp/${lectureVideoUrl}`
    );
    const data = await res.json();

    setSelectedVideoData({
      videoId: lectureVideoUrl,
      otp: data.otp,
      playbackInfo: data.playbackInfo,
    });
    setIsDialogOpen(true);
  };

  console.log("FormDatakhggkgkbkjbkjbkjbkjb ", formData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bonus Courses</h1>
          <p className="text-slate-600 mt-2">
            Manage video tutorials and learning content
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Tutorial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Tutorial</DialogTitle>
            </DialogHeader>
            <form action={handleCreateLecture} className="space-y-4">
              <div>
                <Label htmlFor="title">Tutorial Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter Tutorial title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructorName">Instructor Name</Label>
                <Input
                  id="instructorName"
                  name="instructorName"
                  placeholder="Enter Instructor Name "
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter Tutorial description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_image">Thumbnail Image</Label>
                <Input
                  id="thumbnail_image"
                  name="thumbnail_image"
                  type="file"
                  accept="image/*"
                />
              </div>
              <div>
                <Label htmlFor="video">Video File</Label>
                <Input id="video" name="video" type="file" accept="video/*" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  Upload Tutorial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search Tutorials, instructors, courses..."
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
        </div>

        {/* More Filters Panel */}
        {showMoreFilters && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (0-30 min)</SelectItem>
                  <SelectItem value="medium">Medium (30-60 min)</SelectItem>
                  <SelectItem value="long">Long (60+ min)</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Upload Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Views" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (0-500)</SelectItem>
                  <SelectItem value="medium">Medium (500-1000)</SelectItem>
                  <SelectItem value="high">High (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowMoreFilters(false)}
              >
                Clear Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lectures Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Tutorial
              </TableHead>
              {/* <TableHead className="font-semibold text-slate-700">Course</TableHead> */}
              <TableHead className="font-semibold text-slate-700">
                Instructor
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Duration
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Views
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLectures?.map((lecture) => (
              <TableRow
                key={lecture._id}
                onClick={() => {
                  handleSelectedVideo(lecture.videoUrl);
                  setIsDialogOpen(true);
                }}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={lecture?.thumbnail_image || "/placeholder.svg"}
                        alt={lecture.title}
                        className="h-12 w-16 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white bg-black bg-opacity-50 rounded-full p-1" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {lecture.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        Uploaded{" "}
                        {new Date(lecture.createdAt)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {lecture.course}
                  </Badge>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        {lecture.instructorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="font-medium text-slate-900">
                      {lecture?.instructorName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{lecture.duration}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">1234</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lecture.status === "Published" ? "default" : "secondary"
                    }
                    className={
                      lecture.status === "Published"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {lecture.status}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditLecture(lecture._id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(lecture)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lecture
                      </DropdownMenuItem>
                      {lecture.status === "Draft" && (
                        <DropdownMenuItem
                          onClick={() => handlePublishLecture(lecture._id)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteLecture(lecture._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Lecture
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl w-full p-4">
          <DialogHeader>
            <DialogTitle>Lecture Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideoData && (
              <VideoPlayer
                otp={selectedVideoData.otp}
                playbackInfo={selectedVideoData.playbackInfo}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Lecture Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lecture Details</DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-4">
              {/* Video placeholder */}
              {/* <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
              <Play className="h-12 w-12 text-slate-400 " />
            </div> */}

              {/* Editable form fields */}
              <div className="grid gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Instructor</Label>
                  <Input
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleChange}
                  />
                </div>
                {/* <div>
                <Label>Duration</Label>
                <Input name="duration" value={formData.duration} onChange={handleChange} />
              </div> */}
                <div>
                  <div>
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-sm font-medium text-gray-700">
                        Thumbnail Image URL
                      </span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {formData.thumbnail_image}
                      </p>
                    </div>
                    <button
                      onClick={changeThubnailImage}
                      className="border border-gray-500 text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Change Thumbnail Image
                    </button>
                    <Input
                      name="thumbnail_image"
                      ref={thumbnailRef}
                      type="file"
                      onChange={handleThumbnailEdit}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 py-2 mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        Video URL
                      </span>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {typeof formData?.videoUrl === "string"
                          ? formData.videoUrl
                          : formData?.videoUrl?.name}
                      </p>
                    </div>
                    <button
                      onClick={selectTutorialVideo}
                      className="border border-gray-500 text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Change Video Tutorial
                    </button>
                    <Input
                      name="videoUrl"
                      type="file"
                      accept="video/*"
                      ref={vidRef}
                      onChange={handleTutorialChange}
                      className="hidden"
                    />
                  </div>
                  {/* <Label>Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select> */}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Showing {filteredLectures?.length} of {filteredLectures?.length}{" "}
          lectures
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
    </div>
  );
}
