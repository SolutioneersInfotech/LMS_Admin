// pages/jobs/index.jsx
import { useEffect, useState } from "react";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CalendarDays,
  MapPin,
  Briefcase,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFetchData } from "@/hooks/useFetchData";
import { Button } from "./ui/button";
import JobPostForm from "./JobPostForm";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteData } from "@/hooks/useDeleteData";

export default function JobListPage() {
  const [allJobPosts, setAllJobPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobPostIdToDelete, setJobPostIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<FormData | null>(null);

  const {
    data: jobs,
    isLoading,
    error,
  } = useFetchData("allJobs", "https://lms-backend-three-sandy.vercel.app/api/getAllJobs");

  useEffect(() => {
    if (jobs) {
      setAllJobPosts(jobs.allJobPosts);
    }
  }, [jobs]);

  const handleEdit = (job) => {
    setShowModal(true);
    setEditingJob(job);
  };

  const {
    mutate: deleteJobPost,
    isPending,
    isSuccess,
  } = useDeleteData(
    `https://lms-backend-three-sandy.vercel.app/api/deleteJobPost/${jobPostIdToDelete}`
  );

  const handleDelete = (job_id) => {
    setJobPostIdToDelete(job_id);
    if (jobPostIdToDelete) {
      deleteJobPost();
    }
  };

  const queryClient = useQueryClient();
  queryClient.invalidateQueries(["allJobs"]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Onboardings</h1>
          <p className="text-slate-600 mt-2">Manage Job Posts</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-2 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-hidden p-0">
            {/* Sticky Header */}
            <div className="sticky top-0  bg-white p-4 border-b">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
              </DialogHeader>
            </div>

            {/* Scrollable Body */}
            <div
              className="overflow-y-auto p-4 max-h-[calc(90vh-72px)]"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <JobPostForm onSuccess={() => setShowCreateModal(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Company
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Title
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Location
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                CTC
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Experience
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Apply By
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
            {allJobPosts?.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={job.organisation_logo_url || "/placeholder.svg"}
                      alt="logo"
                      className="h-10 w-10 object-contain bg-slate-100 rounded"
                    />
                    <div>
                      <div className="font-medium text-slate-900">
                        {job.organisation_title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {job.job_source}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium text-slate-900">
                    {job.job_title}
                  </div>
                  <div className="text-xs text-slate-500">{job.job_type}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{job.locations}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-slate-700 text-sm">
                    {job.min_ctc} - {job.max_ctc}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">
                      {job.min_years_of_experience} -{" "}
                      {job.max_years_of_experience} yrs{" "}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-slate-600">
                    <CalendarDays className="h-4 w-4" />
                    <span className="font-medium">{job.apply_by}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      job.is_user_not_eligible_for_job ? "secondary" : "default"
                    }
                    className={
                      job.is_user_not_eligible_for_job
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }
                  >
                    {job.is_user_not_eligible_for_job ? "Ineligible" : "Active"}
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
                      <DropdownMenuItem onClick={() => handleView(job)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(job)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] overflow-hidden p-0">
          {/* Sticky Header */}
          <div className="sticky top-0  bg-white p-4 border-b">
            <DialogHeader>
              <DialogTitle>Update Job Post</DialogTitle>
            </DialogHeader>
          </div>

          {/* Scrollable Body */}
          <div
            className="overflow-y-auto p-4 max-h-[calc(90vh-72px)]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <JobPostForm
              onSuccess={() => setShowModal(false)}
              initialData={editingJob}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
