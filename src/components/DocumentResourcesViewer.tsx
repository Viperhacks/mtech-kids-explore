
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getResources, getResourcesForAnyOne } from "@/services/apiService";
import { useAuth } from "@/context/AuthContext";
import { FileText, Eye, Loader2 } from "lucide-react";
import DocumentViewer from "./DocumentViewer";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userTrackingService } from "@/lib/userTracking";
import FloatingBackButton from "./FloatingBackButton";

interface DocumentResourcesViewerProps {
  grade?: string;
  subject?: string;
  limit?: number;
}

const DocumentResourcesViewer: React.FC<DocumentResourcesViewerProps> = ({
  grade,
  subject,
  limit = 6,
}) => {
  const [resources, setResources] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, updateUserProgress } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(subject);
  const navigate = useNavigate();

  // Get recommended grade if not provided
  const getRecommendedGrade = () => user?.grade || user?.gradeLevel || '1';

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setLoading(false); // Set loading to false immediately if not logged in
    }
  }, [grade, selectedSubject, user]); // Added `user` as a dependency

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const gradeToUse = grade || getRecommendedGrade();

      let response;
      if (user?.role === "TEACHER") {
        response = await getResources();
      } else {
        // Check if user is logged in and provide no arguments if not
        if (user) {
          response = await getResourcesForAnyOne(gradeToUse, selectedSubject);
        } else {
          response = await getResourcesForAnyOne(); // Pass no arguments when not logged in
        }
      }

      // Ensure the response is typed correctly
      const resources = response.resources as { response: { type: string; subject: string } }[];

      const documentResources = resources.filter(
        (resource) => resource.response.type === "document"
      );

      // Extract unique subjects
      const uniqueSubjects = [
        ...new Set(documentResources.map((resource) => resource.response.subject)),
      ];

      setSubjects(uniqueSubjects);

      // Filter for document type resources only
      
     

      const limitedResources = limit ? documentResources.slice(0, limit) : documentResources;
       console.log("limited",limitedResources)

      setResources(limitedResources);

      if (limitedResources.length === 0) {
        toast.info("No document resources found for this grade/subject");
      }
    } catch (error) {
      console.error("Error fetching document resources:", error);
      toast.error("Failed to load document resources");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const handleDocumentComplete = () => {
    if (user && selectedDocument?.response?.id) {
      updateUserProgress(
        selectedDocument.response.subject,
        selectedDocument.response.id,
        resources.length
      );
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // Get viewed documents from user-specific localStorage
  const viewedDocuments = user ? 
    userTrackingService.getUserData(`viewedDocuments`, {}) : 
    JSON.parse(localStorage.getItem("viewedDocuments") || "{}");

  return (
    <div>
      {user === null ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">You are not logged in</h3>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to access the document resources.
          </p>
          <Button
            variant="default"
            className="mt-4"
            onClick={() =>
              navigate("/", { state: { showLogin: true } })
            }
          >
            Log in
          </Button>
        </div>
      ) : (
        <div>
          {/*<div className="mb-4">
            <label htmlFor="subject-select" className="text-sm font-medium text-gray-700">Select Subject</label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {capitalize(subject.split(' ')[0])}
                </option>
              ))}
            </select>
          </div>*/}

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
            </div>
          ) : (
            <div>
              {resources.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No documents available</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    There are no document resources available for this grade/subject combination.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((doc) => {
                    const isViewed = viewedDocuments[doc.response.id]?.lastViewed;
                    const isCompleted = viewedDocuments[doc.response.id]?.completed;
                    const progress = viewedDocuments[doc.response.id]?.progress || 0;
                    
                    return (
                      <Card key={doc.response.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{capitalize(doc.response.title.split(' ')[0])}</CardTitle>
                              <CardDescription className="text-xs">
                                {`${capitalize(doc.response.subject.split(' ')[0])} (Grade ${doc.response.grade})`} 
                              </CardDescription>
                            </div>
                            {isCompleted && (
                              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Completed
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <FileText className="h-5 w-5 text-mtech-primary" />
                            <span>Document</span>
                            {isViewed && (
                              <div className="ml-auto text-xs text-gray-500">
                                {isCompleted ? "Read" : `${progress}% read`}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t">
                          <Button 
                            variant="default" 
                            className="w-full" 
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {isViewed ? "Continue Reading" : "View Document"}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.response?.title}</DialogTitle>
            <DialogDescription>
              {`${selectedDocument?.response?.subject} (Grade ${selectedDocument?.response?.grade})`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <DocumentViewer
              documentUrl={selectedDocument.response.content}
              documentId={selectedDocument.response.id}
              documentTitle={selectedDocument.response.title}
              onComplete={handleDocumentComplete}
            />
          )}
        </DialogContent>
      </Dialog>
      <FloatingBackButton/>
    </div>
  );
};

export default DocumentResourcesViewer;
