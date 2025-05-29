"use client"

import * as React from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Play, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const lectures = [
  {
    id: 1,
    title: "Introduction to React Components",
    course: "React Fundamentals",
    instructor: "Sarah Johnson",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    duration: "45:30",
    views: 1234,
    status: "Published",
    uploadDate: "2024-01-15",
    thumbnail: "/placeholder.svg?height=60&width=80",
    description: "Learn the basics of React components and how to create your first component.",
  },
  {
    id: 2,
    title: "Understanding JSX Syntax",
    course: "React Fundamentals",
    instructor: "Sarah Johnson",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    duration: "32:15",
    views: 987,
    status: "Published",
    uploadDate: "2024-01-18",
    thumbnail: "/placeholder.svg?height=60&width=80",
    description: "Deep dive into JSX syntax and best practices for writing clean React code.",
  },
  {
    id: 3,
    title: "State Management with Hooks",
    course: "React Fundamentals",
    instructor: "Sarah Johnson",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    duration: "58:42",
    views: 756,
    status: "Draft",
    uploadDate: "2024-01-20",
    thumbnail: "/placeholder.svg?height=60&width=80",
    description: "Master React hooks for effective state management in your applications.",
  },
  {
    id: 4,
    title: "Advanced JavaScript Concepts",
    course: "Advanced JavaScript",
    instructor: "Mike Chen",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    duration: "67:20",
    views: 2156,
    status: "Published",
    uploadDate: "2024-01-12",
    thumbnail: "/placeholder.svg?height=60&width=80",
    description: "Explore advanced JavaScript concepts including closures, prototypes, and async programming.",
  },
]

export function LecturesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [courseFilter, setCourseFilter] = React.useState("all")
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [showMoreFilters, setShowMoreFilters] = React.useState(false)
  const [selectedLecture, setSelectedLecture] = React.useState<(typeof lectures)[0] | null>(null)
  const [showViewModal, setShowViewModal] = React.useState(false)
  const { toast } = useToast()

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lecture.status.toLowerCase() === statusFilter
    const matchesCourse = courseFilter === "all" || lecture.course === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  const handleCreateLecture = (formData: FormData) => {
    const title = formData.get("title") as string
    const course = formData.get("course") as string
    const description = formData.get("description") as string

    console.log("Creating lecture:", { title, course, description })
    toast({
      title: "Lecture Created",
      description: `"${title}" has been successfully created.`,
    })
    setShowCreateModal(false)
  }

  const handleViewDetails = (lecture: (typeof lectures)[0]) => {
    setSelectedLecture(lecture)
    setShowViewModal(true)
  }

  const handleEditLecture = (lectureId: number) => {
    console.log("Edit lecture:", lectureId)
    toast({
      title: "Edit Lecture",
      description: "Opening lecture editor...",
    })
  }

  const handleDeleteLecture = (lectureId: number) => {
    console.log("Delete lecture:", lectureId)
    toast({
      title: "Lecture Deleted",
      description: "The lecture has been successfully deleted.",
      variant: "destructive",
    })
  }

  const handlePublishLecture = (lectureId: number) => {
    console.log("Publish lecture:", lectureId)
    toast({
      title: "Lecture Published",
      description: "The lecture is now live and available to students.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lectures</h1>
          <p className="text-slate-600 mt-2">Manage video lectures and learning content</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Lecture
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Lecture</DialogTitle>
            </DialogHeader>
            <form action={handleCreateLecture} className="space-y-4">
              <div>
                <Label htmlFor="title">Lecture Title</Label>
                <Input id="title" name="title" placeholder="Enter lecture title" required />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Select name="course" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="React Fundamentals">React Fundamentals</SelectItem>
                    <SelectItem value="Advanced JavaScript">Advanced JavaScript</SelectItem>
                    <SelectItem value="Python for Data Science">Python for Data Science</SelectItem>
                    <SelectItem value="UI/UX Design Principles">UI/UX Design Principles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Enter lecture description" rows={3} />
              </div>
              <div>
                <Label htmlFor="video">Video File</Label>
                <Input id="video" name="video" type="file" accept="video/*" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  Upload Lecture
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
              placeholder="Search lectures, instructors, courses..."
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

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="React Fundamentals">React Fundamentals</SelectItem>
              <SelectItem value="Advanced JavaScript">Advanced JavaScript</SelectItem>
              <SelectItem value="Python for Data Science">Python for Data Science</SelectItem>
              <SelectItem value="UI/UX Design Principles">UI/UX Design Principles</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-slate-200" onClick={() => setShowMoreFilters(!showMoreFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
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
              <Button variant="outline" onClick={() => setShowMoreFilters(false)}>
                Clear Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Apply Filters</Button>
            </div>
          </div>
        )}
      </div>

      {/* Lectures Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Lecture</TableHead>
              <TableHead className="font-semibold text-slate-700">Course</TableHead>
              <TableHead className="font-semibold text-slate-700">Instructor</TableHead>
              <TableHead className="font-semibold text-slate-700">Duration</TableHead>
              <TableHead className="font-semibold text-slate-700">Views</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLectures.map((lecture) => (
              <TableRow key={lecture.id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={lecture.thumbnail || "/placeholder.svg"}
                        alt={lecture.title}
                        className="h-12 w-16 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white bg-black bg-opacity-50 rounded-full p-1" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{lecture.title}</div>
                      <div className="text-sm text-slate-500">Uploaded {lecture.uploadDate}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {lecture.course}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={lecture.instructorAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        {lecture.instructor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-900">{lecture.instructor}</span>
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
                    <span className="font-medium">{lecture.views.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={lecture.status === "Published" ? "default" : "secondary"}
                    className={
                      lecture.status === "Published"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {lecture.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(lecture)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditLecture(lecture.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lecture
                      </DropdownMenuItem>
                      {lecture.status === "Draft" && (
                        <DropdownMenuItem onClick={() => handlePublishLecture(lecture.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteLecture(lecture.id)}>
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

      {/* View Lecture Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lecture Details</DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedLecture.title}</h3>
                <p className="text-slate-600 mt-1">{selectedLecture.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Course:</span>
                  <div className="font-medium">{selectedLecture.course}</div>
                </div>
                <div>
                  <span className="text-slate-500">Instructor:</span>
                  <div className="font-medium">{selectedLecture.instructor}</div>
                </div>
                <div>
                  <span className="text-slate-500">Duration:</span>
                  <div className="font-medium">{selectedLecture.duration}</div>
                </div>
                <div>
                  <span className="text-slate-500">Views:</span>
                  <div className="font-medium">{selectedLecture.views.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowViewModal(false)} className="flex-1">
                  Close
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  onClick={() => handleEditLecture(selectedLecture.id)}
                >
                  Edit Lecture
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Showing {filteredLectures.length} of {lectures.length} lectures
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
  )
}
