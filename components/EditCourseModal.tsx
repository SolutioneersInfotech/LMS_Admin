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
import { Plus, Trash2, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface EditCourseModalProps {
  course: any;
  onClose: () => void;
  onSave: (course: any) => void;
}

function EditCourseModal({ course, onClose, onSave }: EditCourseModalProps) {
  const [editingCourse, setEditingCourse] = React.useState(course);
  const [openModules, setOpenModules] = React.useState<string[]>([]);
  const [openTopics, setOpenTopics] = React.useState<string[]>([]);
  const { toast } = useToast();

  // Initialize open modules and topics on component mount
  React.useEffect(() => {
    // Open the first module by default if there are modules
    if (editingCourse.modules && editingCourse.modules.length > 0) {
      const firstModuleId =
        editingCourse.modules[0]._id || editingCourse.modules[0].id;
      setOpenModules([firstModuleId]);
    }
  }, []);

  // Helper function to get the correct ID (handles both _id and id)
  const getId = (item: any) => item._id || item.id;

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setOpenTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const updateCourse = (field: string, value: any) => {
    setEditingCourse((prev) => ({ ...prev, [field]: value }));
  };

  const updateModule = (moduleId: string, field: string, value: any) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId ? { ...module, [field]: value } : module
      ),
    }));
  };

  const updateTopic = (
    moduleId: string,
    topicId: string,
    field: string,
    value: any
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId ? { ...topic, [field]: value } : topic
              ),
            }
          : module
      ),
    }));
  };

  const updateSubtopic = (
    moduleId: string,
    topicId: string,
    subtopicId: string,
    field: string,
    value: any
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) =>
                        getId(subtopic) === subtopicId
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

  const updateVideoLanguage = (
    moduleId: string,
    topicId: string,
    subtopicId: string,
    language: string,
    url: string
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) => {
                        if (getId(subtopic) === subtopicId) {
                          // Create a new video_language object or update existing one
                          const updatedVideoLanguage = {
                            ...(subtopic.video_language || {}),
                            [language]: url,
                          };
                          return {
                            ...subtopic,
                            video_language: updatedVideoLanguage,
                          };
                        }
                        return subtopic;
                      }),
                    }
                  : topic
              ),
            }
          : module
      ),
    }));
  };
  

  const changeVideoLanguageKey = (
    moduleId: string,
    topicId: string,
    subtopicId: string,
    oldLanguage: string,
    newLanguage: string
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) => {
                        if (getId(subtopic) === subtopicId) {
                          const updatedVideoLanguage = {
                            ...(subtopic.video_language || {}),
                          };
                          // Store the URL associated with the old language
                          const url = updatedVideoLanguage[oldLanguage];
                          // Delete the old language entry
                          delete updatedVideoLanguage[oldLanguage];
                          // Add the new language entry with the same URL
                          updatedVideoLanguage[newLanguage] = url;

                          return {
                            ...subtopic,
                            video_language: updatedVideoLanguage,
                          };
                        }
                        return subtopic;
                      }),
                    }
                  : topic
              ),
            }
          : module
      ),
    }));
  };

  const deleteVideoLanguage = (
    moduleId: string,
    topicId: string,
    subtopicId: string,
    language: string
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.map((subtopic) => {
                        if (getId(subtopic) === subtopicId) {
                          const updatedVideoLanguage = {
                            ...(subtopic.video_language || {}),
                          };
                          delete updatedVideoLanguage[language];
                          return {
                            ...subtopic,
                            video_language: updatedVideoLanguage,
                          };
                        }
                        return subtopic;
                      }),
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
      id: `temp-${Date.now()}`, // Temporary ID until saved to database
      title: "New Module",
      description: "Module description",
      topics: [],
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    // Open the newly added module
    setOpenModules((prev) => [...prev, newModule.id]);
  };

  const addTopic = (moduleId: string) => {
    const newTopic = {
      id: `temp-${Date.now()}`, // Temporary ID until saved to database
      title: "New Topic",
      description: "Topic description",
      subtopics: [],
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? { ...module, topics: [...module.topics, newTopic] }
          : module
      ),
    }));
    // Open the newly added topic
    setOpenTopics((prev) => [...prev, newTopic.id]);
  };

  const addSubtopic = (moduleId: string, topicId: string) => {
    const newSubtopic = {
      id: `temp-${Date.now()}`, // Temporary ID until saved to database
      title: "New Subtopic",
      video_language: { English: "" }, // Initialize with empty English video URL
    };
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? { ...topic, subtopics: [...topic.subtopics, newSubtopic] }
                  : topic
              ),
            }
          : module
      ),
    }));
  };

  const addVideoLanguage = (
    moduleId: string,
    topicId: string,
    subtopicId: string
  ) => {
    // Find an available language that's not already used
    const availableLanguages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Chinese",
      "Japanese",
      "Hindi",
    ];

    setEditingCourse((prev) => {
      // Find the subtopic to check existing languages
      let existingLanguages: string[] = [];
      for (const module of prev.modules) {
        if (getId(module) === moduleId) {
          for (const topic of module.topics) {
            if (getId(topic) === topicId) {
              for (const subtopic of topic.subtopics) {
                if (getId(subtopic) === subtopicId) {
                  existingLanguages = Object.keys(
                    subtopic.video_language || {}
                  );
                  break;
                }
              }
            }
          }
        }
      }

      // Find first available language not already used
      const newLanguage =
        availableLanguages.find((lang) => !existingLanguages.includes(lang)) ||
        "Other";

      // Update the course with the new language
      return {
        ...prev,
        modules: prev.modules.map((module) =>
          getId(module) === moduleId
            ? {
                ...module,
                topics: module.topics.map((topic) =>
                  getId(topic) === topicId
                    ? {
                        ...topic,
                        subtopics: topic.subtopics.map((subtopic) => {
                          if (getId(subtopic) === subtopicId) {
                            return {
                              ...subtopic,
                              video_language: {
                                ...(subtopic.video_language || {}),
                                [newLanguage]: "",
                              },
                            };
                          }
                          return subtopic;
                        }),
                      }
                    : topic
                ),
              }
            : module
        ),
      };
    });
  };

  const deleteModule = (moduleId: string) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((module) => getId(module) !== moduleId),
    }));
    toast({
      title: "Module Deleted",
      description: "The module has been removed from the course.",
    });
  };

  const deleteTopic = (moduleId: string, topicId: string) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.filter((topic) => getId(topic) !== topicId),
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
    moduleId: string,
    topicId: string,
    subtopicId: string
  ) => {
    setEditingCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        getId(module) === moduleId
          ? {
              ...module,
              topics: module.topics.map((topic) =>
                getId(topic) === topicId
                  ? {
                      ...topic,
                      subtopics: topic.subtopics.filter(
                        (subtopic) => getId(subtopic) !== subtopicId
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // open the file picker
    }
  };

  const handleUploadThumbnail = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"
    );
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "default_cloud"
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "default_cloud"
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Uploaded image URL:", data.secure_url);

      if (data.secure_url) {
        updateCourse("thumbnail_image", data.secure_url);
        toast({
          title: "Thumbnail Updated",
          description: "Course thumbnail has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload thumbnail. Please try again.",
        variant: "destructive",
      });
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
                      src={editingCourse.thumbnail_image || "/placeholder.svg"}
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
                {editingCourse?.modules?.map((module) => (
                  <div
                    key={getId(module)}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <Collapsible
                      open={openModules.includes(getId(module))}
                      onOpenChange={() => toggleModule(getId(module))}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer">
                          <div className="flex items-center gap-3 flex-1">
                            {openModules.includes(getId(module)) ? (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            )}
                            <div className="flex-1">
                              <Input
                                value={module.title}
                                onChange={(e) =>
                                  updateModule(
                                    getId(module),
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
                                    getId(module),
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
                                deleteModule(getId(module));
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
                              onClick={() => addTopic(getId(module))}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Topic
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {module.topics.map((topic) => (
                              <div
                                key={getId(topic)}
                                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                              >
                                <Collapsible
                                  open={openTopics.includes(getId(topic))}
                                  onOpenChange={() => toggleTopic(getId(topic))}
                                >
                                  <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer">
                                      <div className="flex items-center gap-3 flex-1">
                                        {openTopics.includes(getId(topic)) ? (
                                          <ChevronDown className="h-4 w-4 text-slate-400" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-slate-400" />
                                        )}
                                        <div className="flex-1">
                                          <Input
                                            value={topic.title}
                                            onChange={(e) =>
                                              updateTopic(
                                                getId(module),
                                                getId(topic),
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
                                                getId(module),
                                                getId(topic),
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
                                            deleteTopic(
                                              getId(module),
                                              getId(topic)
                                            );
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
                                            addSubtopic(
                                              getId(module),
                                              getId(topic)
                                            )
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
                                            key={getId(subtopic)}
                                            className="p-3 bg-white rounded border border-slate-200 space-y-2"
                                          >
                                            <div className="flex items-center gap-3">
                                              <Video className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                              <Input
                                                value={subtopic?.title || ""}
                                                onChange={(e) =>
                                                  updateSubtopic(
                                                    getId(module),
                                                    getId(topic),
                                                    getId(subtopic),
                                                    "title",
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="Subtopic title"
                                                className="text-sm"
                                              />
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                                onClick={() =>
                                                  deleteSubtopic(
                                                    getId(module),
                                                    getId(topic),
                                                    getId(subtopic)
                                                  )
                                                }
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>

                                            <div className="space-y-2 pl-7">
                                              <div className="flex items-center justify-between">
                                                <Label className="text-xs text-slate-600">
                                                  Video URLs by Language
                                                </Label>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="text-xs h-6 px-2"
                                                  onClick={() =>
                                                    addVideoLanguage(
                                                      getId(module),
                                                      getId(topic),
                                                      getId(subtopic)
                                                    )
                                                  }
                                                >
                                                  <Plus className="h-3 w-3 mr-1" />
                                                  Add Language
                                                </Button>
                                              </div>

                                              {/* Display existing language videos */}
                                              {Object.entries(
                                                subtopic?.video_language || {}
                                              ).map(([language, url]) => (
                                                <div
                                                  key={language}
                                                  className="flex items-center gap-2"
                                                >
                                                  <Select
                                                    value={language.toLowerCase()}
                                                    onValueChange={(
                                                      newLanguageLower
                                                    ) => {
                                                      const newLanguage =
                                                        newLanguageLower
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                        newLanguageLower.slice(
                                                          1
                                                        );

                                                      changeVideoLanguageKey(
                                                        getId(module),
                                                        getId(topic),
                                                        getId(subtopic),
                                                        language,
                                                        newLanguage
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger className="text-xs w-48">
                                                      <SelectValue placeholder="Select Language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="english">
                                                        English
                                                      </SelectItem>
                                                      <SelectItem value="spanish">
                                                        Spanish
                                                      </SelectItem>
                                                      <SelectItem value="french">
                                                        French
                                                      </SelectItem>
                                                      <SelectItem value="german">
                                                        German
                                                      </SelectItem>
                                                      <SelectItem value="chinese">
                                                        Chinese
                                                      </SelectItem>
                                                      <SelectItem value="japanese">
                                                        Japanese
                                                      </SelectItem>
                                                      <SelectItem value="hindi">
                                                        Hindi
                                                      </SelectItem>
                                                    </SelectContent>
                                                  </Select>

                                                  <div className="relative flex-1">
                                                    <LinkIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                      required
                                                      value={url as string}
                                                      onChange={(e) => {
                                                        updateVideoLanguage(
                                                          getId(module),
                                                          getId(topic),
                                                          getId(subtopic),
                                                          language,
                                                          e.target.value
                                                        );
                                                      }}
                                                      placeholder="Video URL"
                                                      className={cn(
                                                        "text-xs pl-7 w-full",
                                                        url.trim() === "" &&
                                                          "border border-red-500"
                                                      )}
                                                    />
                                                  </div>

                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                                                    onClick={() => {
                                                      deleteVideoLanguage(
                                                        getId(module),
                                                        getId(topic),
                                                        getId(subtopic),
                                                        language
                                                      );
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              ))}
                                            </div>
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
