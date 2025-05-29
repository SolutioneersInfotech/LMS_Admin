"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

const topicsData = [
  {
    id: 1,
    title: "Introduction to React",
    courseTitle: "React Fundamentals",
    progress: 85,
    totalSubtopics: 5,
    completedSubtopics: 4,
    subtopics: [
      { id: 1, title: "What is React?", completed: true },
      { id: 2, title: "Setting up Development Environment", completed: true },
      { id: 3, title: "Creating Your First Component", completed: true },
      { id: 4, title: "Understanding JSX", completed: true },
      { id: 5, title: "Props and State", completed: false },
    ],
  },
  {
    id: 2,
    title: "Component Lifecycle",
    courseTitle: "React Fundamentals",
    progress: 60,
    totalSubtopics: 4,
    completedSubtopics: 2,
    subtopics: [
      { id: 6, title: "Mounting Phase", completed: true },
      { id: 7, title: "Updating Phase", completed: true },
      { id: 8, title: "Unmounting Phase", completed: false },
      { id: 9, title: "Error Handling", completed: false },
    ],
  },
  {
    id: 3,
    title: "Hooks and Modern React",
    courseTitle: "React Fundamentals",
    progress: 25,
    totalSubtopics: 6,
    completedSubtopics: 1,
    subtopics: [
      { id: 10, title: "Introduction to Hooks", completed: true },
      { id: 11, title: "useState Hook", completed: false },
      { id: 12, title: "useEffect Hook", completed: false },
      { id: 13, title: "Custom Hooks", completed: false },
      { id: 14, title: "Context API", completed: false },
      { id: 15, title: "Performance Optimization", completed: false },
    ],
  },
]

export function TopicsPage() {
  const [openTopics, setOpenTopics] = React.useState<number[]>([1])
  const [topics, setTopics] = React.useState(topicsData)

  const [showAddTopicModal, setShowAddTopicModal] = React.useState(false)
  const [showAddSubtopicModal, setShowAddSubtopicModal] = React.useState(false)
  const [selectedTopicForSubtopic, setSelectedTopicForSubtopic] = React.useState<number | null>(null)

  const toggleTopic = (topicId: number) => {
    setOpenTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const toggleSubtopic = (topicId: number, subtopicId: number) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id === topicId) {
          const updatedSubtopics = topic.subtopics.map((subtopic) =>
            subtopic.id === subtopicId ? { ...subtopic, completed: !subtopic.completed } : subtopic,
          )
          const completedCount = updatedSubtopics.filter((s) => s.completed).length
          const progress = Math.round((completedCount / updatedSubtopics.length) * 100)

          return {
            ...topic,
            subtopics: updatedSubtopics,
            completedSubtopics: completedCount,
            progress,
          }
        }
        return topic
      }),
    )
  }

  const handleEditTopic = (topicId: number) => {
    console.log("Edit topic:", topicId)
    // Add your edit topic logic here
  }

  const handleDeleteTopic = (topicId: number) => {
    console.log("Delete topic:", topicId)
    // Add your delete topic logic here
  }

  const handleAddSubtopic = (topicId: number) => {
    setSelectedTopicForSubtopic(topicId)
    setShowAddSubtopicModal(true)
  }

  const handleEditSubtopic = (topicId: number, subtopicId: number) => {
    console.log("Edit subtopic:", subtopicId, "in topic:", topicId)
    // Add your edit subtopic logic here
  }

  const handleDeleteSubtopic = (topicId: number, subtopicId: number) => {
    console.log("Delete subtopic:", subtopicId, "from topic:", topicId)
    // Add your delete subtopic logic here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Topics & Subtopics</h1>
          <p className="text-slate-600 mt-2">Manage course content structure and track progress</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddTopicModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Topic
        </Button>
      </div>

      {/* Course Filter */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Course:</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            React Fundamentals
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Total Topics: {topics.length}</span>
          <span>•</span>
          <span>Total Subtopics: {topics.reduce((acc, topic) => acc + topic.totalSubtopics, 0)}</span>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <Collapsible open={openTopics.includes(topic.id)} onOpenChange={() => toggleTopic(topic.id)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {openTopics.includes(topic.id) ? (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {topic.completedSubtopics} of {topic.totalSubtopics} subtopics completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right min-w-0">
                      <div className="text-sm font-medium text-slate-900">{topic.progress}%</div>
                      <Progress value={topic.progress} className="w-24 h-2 mt-1" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTopic(topic.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Topic
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddSubtopic(topic.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Subtopic
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTopic(topic.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Topic
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-slate-200 bg-slate-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">Subtopics</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => handleAddSubtopic(topic.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Subtopic
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {topic.subtopics.map((subtopic) => (
                        <div
                          key={subtopic.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={subtopic.completed}
                              onCheckedChange={() => toggleSubtopic(topic.id, subtopic.id)}
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <span
                              className={`font-medium ${
                                subtopic.completed ? "text-slate-500 line-through" : "text-slate-900"
                              }`}
                            >
                              {subtopic.title}
                            </span>
                            {subtopic.completed && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSubtopic(topic.id, subtopic.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Subtopic
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteSubtopic(topic.id, subtopic.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Subtopic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">
            {topics.reduce((acc, topic) => acc + topic.completedSubtopics, 0)}
          </div>
          <div className="text-sm text-slate-600">Completed Subtopics</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(topics.reduce((acc, topic) => acc + topic.progress, 0) / topics.length)}%
          </div>
          <div className="text-sm text-slate-600">Average Progress</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">
            {topics.reduce((acc, topic) => acc + topic.totalSubtopics, 0)}
          </div>
          <div className="text-sm text-slate-600">Total Subtopics</div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>
            <div className="space-y-4">
              <Input placeholder="Topic Title" />
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg resize-none"
                placeholder="Topic Description"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddTopicModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => {
                  console.log("Adding topic...")
                  setShowAddTopicModal(false)
                }}
              >
                Add Topic
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subtopic Modal */}
      {showAddSubtopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Subtopic</h3>
            <div className="space-y-4">
              <Input placeholder="Subtopic Title" />
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg resize-none"
                placeholder="Subtopic Description"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSubtopicModal(false)
                  setSelectedTopicForSubtopic(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => {
                  console.log("Adding subtopic to topic:", selectedTopicForSubtopic)
                  setShowAddSubtopicModal(false)
                  setSelectedTopicForSubtopic(null)
                }}
              >
                Add Subtopic
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
