"use client";
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
import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCourseModalProps {
  course: any;
  onClose: () => void;
  onSave: (course: any) => void;
}

function EditCourseModal({ course, onClose, onSave }: EditCourseModalProps) {
  const [editingCourse, setEditingCourse] = React.useState(course);
  const [openModules, setOpenModules] = React.useState<number[]>([]);
  const [openTopics, setOpenTopics] = React.useState<number[]>([]);
  const { toast } = useToast();

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleTopic = (topicId: number) => {
    setOpenTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const updateCourse = (field: string, value: any) => {
    setEditingCourse((prev) => ({ ...prev, [field]: value }));
  };

  const updateModule = (moduleId: number, field: string, value: any) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId ? { ...module, [field]: value } : module
      ),
    }));
  };

  const updateTopic = (
    moduleId: number,
    topicId: number,
    field: string,
    value: any
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                topic.id === topicId ? { ...topic, [field]: value } : topic
              ),
            }
          : module
      ),
    }));
  };

  const updateSubtopic = (
    moduleId: number,
    topicId: number,
    subtopicId: number,
    field: string,
    value: any
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                topic.id === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) =>
                        subtopic.id === subtopicId
                          ? { ...subtopic, [field]: value }
                          : subtopic
                      ),
                    }
                  : topic
              ),
            }
          : module
      ),
    }));
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: "New Module",
      description: "Module description",
      topics: [],
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const addTopic = (moduleId: number) => {
    const newTopic = {
      id: Date.now(),
      title: "New Topic",
      description: "Topic description",
      subtopics: [],
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? { ...module, topics: [...module.topics, newTopic] }
          : module
      ),
    }));
  };

  const addSubtopic = (moduleId: number, topicId: number) => {
    const newSubtopic = {
      id: Date.now(),
      title: "New Subtopic",
      videoUrl: "",
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                topic.id === topicId
                  ? { ...topic, subtopics: [...topic.subtopics, newSubtopic] }
                  : topic
              ),
            }
          : module
      ),
    }));
  };

  const deleteModule = (moduleId: number) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((module) => module.id !== moduleId),
    }));
    toast({
      title: "Module Deleted",
      description: "The module has been removed from the course.",
    });
  };

  const deleteTopic = (moduleId: number, topicId: number) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.filter((topic) => topic.id !== topicId),
            }
          : module
      ),
    }));
    toast({
      title: "Topic Deleted",
      description: "The topic has been removed from the module.",
    });
  };

  const deleteSubtopic = (
    moduleId: number,
    topicId: number,
    subtopicId: number
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                topic.id === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.filter(
                        (subtopic) => subtopic.id !== subtopicId
                      ),
                    }
                  : topic
              ),
            }
          : module
      ),
    }));
    toast({
      title: "Subtopic Deleted",
      description: "The subtopic has been removed from the topic.",
    });
  };

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // open the file picker
  };

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ); // replace
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ); // optional here

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Uploaded image URL:", data.secure_url);

     if (data.secure_url) {
    updateCourse("thumbnail_image", data.secure_url); 
  }

  };

  console.log("editingCourseeditingCourse", editingCourse)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Edit Course</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Course Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input
                      id="courseTitle"
                      value={editingCourse.title}
                      onChange={(e) => updateCourse("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseCategory">Category</Label>
                    <Select
                      value={editingCourse.category}
                      onValueChange={(value) => updateCourse("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">
                          Web Development
                        </SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Data Science">
                          Data Science
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Course Description</Label>
                  <Textarea
                    id="courseDescription"
                    value={editingCourse.description || ""}
                    onChange={(e) =>
                      updateCourse("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={editingCourse.thumbnail_image || "/placeholder.svg" }
                      alt="Course thumbnail"
                      className="h-20 w-28 rounded-lg object-cover bg-slate-100"
                    />
                    <Button variant="outline" onClick={handleButtonClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Thumbnail
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleUploadThumbnail}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Course Modules</CardTitle>
                  <Button
                    onClick={addModule}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingCourse.modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <Collapsible
                      open={openModules.includes(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer">
                          <div className="flex items-center gap-3 flex-1">
                            {openModules.includes(module.id) ? (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            )}
                            <div className="flex-1">
                              <Input
                                value={module.title}
                                onChange={(e) =>
                                  updateModule(
                                    module.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="font-semibold border-none p-0 h-auto bg-transparent focus:bg-white focus:border-slate-200"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Input
                                value={module.description}
                                onChange={(e) =>
                                  updateModule(
                                    module.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-slate-600 border-none p-0 h-auto bg-transparent focus:bg-white focus:border-slate-200 mt-1"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {module.topics.length} topics
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModule(module.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900">
                              Topics
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addTopic(module.id)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Topic
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {module.topics.map((topic) => (
                              <div
                                key={topic.id}
                                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                              >
                                <Collapsible
                                  open={openTopics.includes(topic.id)}
                                  onOpenChange={() => toggleTopic(topic.id)}
                                >
                                  <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer">
                                      <div className="flex items-center gap-3 flex-1">
                                        {openTopics.includes(topic.id) ? (
                                          <ChevronDown className="h-4 w-4 text-slate-400" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-slate-400" />
                                        )}
                                        <div className="flex-1">
                                          <Input
                                            value={topic.title}
                                            onChange={(e) =>
                                              updateTopic(
                                                module.id,
                                                topic.id,
                                                "title",
                                                e.target.value
                                              )
                                            }
                                            className="font-medium border-none p-0 h-auto bg-transparent focus:bg-white focus:border-slate-200"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <Input
                                            value={topic.description}
                                            onChange={(e) =>
                                              updateTopic(
                                                module.id,
                                                topic.id,
                                                "description",
                                                e.target.value
                                              )
                                            }
                                            className="text-sm text-slate-600 border-none p-0 h-auto bg-transparent focus:bg-white focus:border-slate-200 mt-1"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                          {topic.subtopics.length} subtopics
                                        </Badge>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteTopic(module.id, topic.id);
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="border-t border-slate-200 bg-slate-25 p-3">
                                      <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-slate-800">
                                          Subtopics
                                        </h5>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            addSubtopic(module.id, topic.id)
                                          }
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          <Plus className="h-3 w-3 mr-1" />
                                          Add Subtopic
                                        </Button>
                                      </div>

                                      <div className="space-y-2">
                                        {topic.subtopics.map((subtopic) => (
                                          <div
                                            key={subtopic.id}
                                            className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200"
                                          >
                                            <Video className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                              <Input
                                                value={subtopic.title}
                                                onChange={(e) =>
                                                  updateSubtopic(
                                                    module.id,
                                                    topic.id,
                                                    subtopic.id,
                                                    "title",
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="Subtopic title"
                                                className="text-sm"
                                              />
                                              <div className="relative">
                                                <LinkIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                  value={subtopic.videoUrl}
                                                  onChange={(e) =>
                                                    updateSubtopic(
                                                      module.id,
                                                      topic.id,
                                                      subtopic.id,
                                                      "videoUrl",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Video URL"
                                                  className="text-sm pl-7"
                                                />
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                              onClick={() =>
                                                deleteSubtopic(
                                                  module.id,
                                                  topic.id,
                                                  subtopic.id
                                                )
                                              }
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave(editingCourse)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
