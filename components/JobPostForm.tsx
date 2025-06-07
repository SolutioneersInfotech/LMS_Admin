import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePostData } from "@/hooks/usePostData";
import { useEffect, useState } from "react";
import { usePutData } from "@/hooks/usePutData";

type FormData = {
  organisation_title: string;
  organisation_logo_url: string;
  job_title: string;
  locations: string;
  min_ctc: number;
  max_ctc: number;
  no_of_positions_available: number;
  apply_by: string;
  job_type: "INTERNSHIP" | "FULL_TIME";
  job_source: "INTERNAL" | "EXTERNAL";
  min_years_of_experience: number;
  max_years_of_experience: number;
  link_to_apply: string;
  is_user_not_eligible_for_job: boolean;
};

type JobPostFormProps = {
  onSuccess: () => void;
  initialData?: FormData;
};

export default function JobPostForm({ onSuccess , initialData }: JobPostFormProps) {
  const { register, handleSubmit, setValue, watch , reset  } = useForm<FormData>({
    defaultValues: {
      job_type: "INTERNSHIP",
      job_source: "INTERNAL",
      // ...initialData,
    },
  });

  const [updateapiUrl , setUpdateApiurl] = useState(null);
useEffect(() => {
  if (initialData) {
    const formattedData: FormData = {
      ...initialData,
      min_ctc: Number(initialData.min_ctc),
      max_ctc: Number(initialData.max_ctc),
      no_of_positions_available: Number(initialData.no_of_positions_available),
      min_years_of_experience: Number(initialData.min_years_of_experience),
      max_years_of_experience: Number(initialData.max_years_of_experience),
    };
    reset(formattedData);
  }
}, [initialData, reset]);

  console.log("initialDatainitialData", initialData)
      

  const { mutate } = usePostData("http://localhost:5001/api/createJobs");

  const { mutate: updateJobPost } = usePutData(updateapiUrl || "");

  const onSubmit = (data: FormData) => {
  console.log("Submitted:", data);

  const isEdit = !!initialData?._id;
  const updateUrl = initialData?._id
    ? `http://localhost:5001/api/updateJobPost/${initialData._id}`
    : null;

    console.log("updateUrlupdateUrl", updateUrl);

    setUpdateApiurl(updateUrl)


  if (isEdit && updateUrl) {
    // ✅ Remove _id to avoid MongoDB duplicate key error
    const { _id, ...cleanData } = data;

    updateJobPost(cleanData, {
      onSuccess: (response) => {
        console.log("Job updated:", response);
        onSuccess(); // Refresh UI or close dialog
      },
      onError: (error: any) => {
        console.error("Update failed", error);
      },
    });
  } else {
    mutate(data, {
      onSuccess: (response) => {
        console.log("Job created:", response);
        onSuccess(); // Refresh UI or close dialog
      },
      onError: (error: any) => {
        console.error("Job creation failed", error);
      },
    });
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-2 space-y-6 border rounded-xl shadow-md bg-white">
      <div>
        <Label>Organisation Title</Label>
        <Input {...register("organisation_title")} />
      </div>

      <div>
        <Label>Organisation Logo URL</Label>
        <Input {...register("organisation_logo_url")} />
      </div>

      <div>
        <Label>Job Title</Label>
        <Input {...register("job_title")} />
      </div>

      <div>
        <Label>Locations (comma separated)</Label>
        <Input {...register("locations")} placeholder="e.g., Bengaluru, Work From Home" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Minimum CTC (in LPA)</Label>
          <Input type="number" step="0.1" {...register("min_ctc")} />
        </div>
        <div>
          <Label>Maximum CTC (in LPA)</Label>
          <Input type="number" step="0.1" {...register("max_ctc")} />
        </div>
      </div>

      <div>
        <Label>No. of Positions Available</Label>
        <Input type="number" {...register("no_of_positions_available")} />
      </div>

      <div>
        <Label>Apply By (Deadline)</Label>
        <Input type="datetime-local" {...register("apply_by")} />
      </div>

      <div>
        <Label>Job Type</Label>
        <Select onValueChange={(val) => setValue("job_type", val as FormData["job_type"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Job Source</Label>
        <Select onValueChange={(val) => setValue("job_source", val as FormData["job_source"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select Job Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INTERNAL">Internal</SelectItem>
            <SelectItem value="EXTERNAL">External</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Years of Experience</Label>
          <Input type="number" {...register("min_years_of_experience")} />
        </div>
        <div>
          <Label>Max Years of Experience</Label>
          <Input type="number" {...register("max_years_of_experience")} />
        </div>
      </div>

      <div>
        <Label>Application Link</Label>
        <Input {...register("link_to_apply")} />
      </div>

      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
          Submit
      </Button>
    </form>
  );
}
