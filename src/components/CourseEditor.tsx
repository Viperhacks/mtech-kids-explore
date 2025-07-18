import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash, Save, X } from "lucide-react";
import { resourceService } from "@/lib/api";
import { title } from "process";
import { subjects } from "@/utils/subjectUtils";
import { useAuth } from "@/context/AuthContext";
import { capitalize } from "@/utils/stringUtils";
import { getTeacherSubjects } from "@/services/apiService";

interface CourseEditorProps {
  resource?: any;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
  initialType?: string;
}

const CourseEditor: React.FC<CourseEditorProps> = ({
  resource,
  onSave,
  onCancel,
  isNew = false,
  initialType,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    grade: resource?.grade || "",
    subject: resource?.subject || "",
    type: resource?.type || initialType || "video",
    content: resource?.content || "",
  });
  const { user } = useAuth();
  const assignedLevels = user?.assignedLevels || [];
  const [teacherSubjects, setTeacherSubjects] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const fetchedSubjects = await getTeacherSubjects();
        console.log("Fetched subjects:", fetchedSubjects);

        // If 'All Subjects' is present, replace teacherSubjects with full subject list
        if (fetchedSubjects.includes("All Subjects")) {
          setTeacherSubjects(subjects);
        } else {
          setTeacherSubjects(
            (fetchedSubjects || []).map((name: string, idx: number) => ({
              id: idx,
              name,
            }))
          );
        }
      } catch (error) {
        toast({
          title: "Failed to load subjects",
          description: "Could not fetch your subjects.",
          variant: "destructive",
        });
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [user]);

  // Update form data if resource or initialType changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: resource?.title || prev.title,
      description: resource?.description || prev.description,
      grade: resource?.grade || prev.grade,
      subject: resource?.subject || prev.subject,
      type: resource?.type || initialType || prev.type,
      content: resource?.content || prev.content,
    }));
  }, [resource, initialType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let formDataToSend = new FormData();
      formDataToSend.append("title", capitalize(formData.title));
      formDataToSend.append("description", capitalize(formData.description));
      formDataToSend.append("grade", formData.grade);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("type", formData.type);
      if (formData.content instanceof File) {
        formDataToSend.append("content", formData.content);
      }

      //formDataToSend.append("thumbnail" , formData.thumbnail);

      if (isNew) {
        await resourceService.uploadResource(formDataToSend);
        toast({
          title: "Resource Created",
          description: "Your resource has been successfully created.",
        });
      } else {
        await resourceService.updateResource(resource.id, formDataToSend);
        toast({
          title: "Resource Updated",
          description: "Your resource has been successfully updated.",
        });
      }
      onSave();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: isNew ? "Creation Failed" : "Update Failed",
        description: "There was a problem saving your resource.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!resource?.id) return;

    if (
      !confirm(
        "Are you sure you want to delete this resource? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await resourceService.deleteResource(resource.id);
      toast({
        title: "Resource Deleted",
        description: "The resource has been successfully deleted.",
      });
      onSave();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the resource.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const extractFileName = (value: string) => {
    try {
      if (value.includes("/")) {
        return value.split("/").pop()!;
      }
      if (value.includes("-") && value.length > 20) {
        return "Uploaded File"; // Looks like a UUID or hashed filename
      }
      return value;
    } catch {
      return "Unknown file";
    }
  };

  const getAcceptedFileTypes = () => {
    if (formData.type === "video") {
      return "video/*";
    }
    if (formData.type === "document") {
      return `
      application/pdf,
      application/msword,
      application/vnd.openxmlformats-officedocument.wordprocessingml.document
    `;
    }

    return "";
  };

  if (user?.role === "TEACHER" && assignedLevels.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are not assigned to any grade level. Please contact an
            administrator for access.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isNew ? "Create New Resource" : "Edit Resource"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={capitalize(formData.title)}
              onChange={handleChange}
              placeholder="Resource title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={capitalize(formData.description)}
              onChange={handleChange}
              placeholder="Resource description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleSelectChange("grade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {assignedLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level === "0" ? "ECD" : `Grade ${level}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleSelectChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSubjects ? (
                    <SelectItem value="loading" disabled>
                      Loading subjects...
                    </SelectItem>
                  ) : teacherSubjects.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No subjects assigned
                    </SelectItem>
                  ) : (
                    teacherSubjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.name.toLowerCase()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/*} <div className="space-y-2">
            <Label htmlFor="content">Content URL</Label>
            <Input
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="URL to your content"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="URL to thumbnail image"
            />
          </div>*/}
          <div className="space-y-2">
            <Label>Upload Content (PDF, Image, Word Doc, or Video)</Label>

            <div
              className="border border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (!file) return;

                if (
                  formData.type === "video" &&
                  !file.type.startsWith("video/")
                ) {
                  toast({
                    title: "Invalid file type",
                    description: "Please upload a valid video file.",
                    variant: "destructive",
                  });
                  return;
                }
                if (
                  formData.type === "document" &&
                  ![
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ].includes(file.type)
                ) {
                  toast({
                    title: "Invalid file type",
                    description:
                      "Please upload a valid document file (PDF, Word).",
                    variant: "destructive",
                  });
                  return;
                }

                setFormData((prev) => ({ ...prev, content: file }));
              }}
              onClick={() => document.getElementById("contentUpload")?.click()}
            >
              {formData.content ? (
                <p className="text-sm text-green-600">
                  Selected:{" "}
                  {typeof formData.content === "string"
                    ? extractFileName(formData.content)
                    : formData.content?.name || "No file selected"}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag and drop a video/document here or click to browse
                </p>
              )}
              {formData.content &&
                formData.content.type?.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(formData.content)}
                    alt="Preview"
                    className="mx-auto mt-2 max-h-[200px] rounded-md"
                  />
                )}
            </div>
            <input
              id="contentUpload"
              type="file"
              accept={getAcceptedFileTypes()}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // Check MIME type matches the type selected
                if (
                  formData.type === "video" &&
                  !file.type.startsWith("video/")
                ) {
                  toast({
                    title: "Invalid file type",
                    description: "Please upload a valid video file.",
                    variant: "destructive",
                  });
                  return;
                }
                if (
                  formData.type === "document" &&
                  ![
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ].includes(file.type)
                ) {
                  toast({
                    title: "Invalid file type",
                    description:
                      "Please upload a valid document file (PDF, Word).",
                    variant: "destructive",
                  });
                  return;
                }

                setFormData((prev) => ({ ...prev, content: file }));
              }}
              className="hidden"
            />
          </div>
          {/*
<div className="space-y-2">
  <Label>Upload Thumbnail Image</Label>
  <div
    className="border border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, thumbnail: file }));
      }
    }}
    onClick={() => document.getElementById('thumbnailUpload')?.click()}
  >
    {formData.thumbnail ? (
      <p className="text-sm text-green-600">Selected: {formData.thumbnail.name}</p>
    ) : (
      <p className="text-sm text-gray-500">
        Drag and drop an image here or click to upload thumbnail
      </p>
    )}
  </div>
  <input
    id="thumbnailUpload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, thumbnail: file }));
      }
    }}
    className="hidden"
  />
</div>*/}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || isDeleting}
              className="mr-2"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
              >
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isLoading || isDeleting}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CourseEditor;
