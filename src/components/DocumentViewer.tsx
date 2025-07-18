
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { userTrackingService } from "@/lib/userTracking";
import { completionService } from "@/services/completionService";
import { useCompletion } from "@/context/CompletionContext";


// Configure PDF.js worker for offline use
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";


interface DocumentViewerProps {
  documentUrl: string;
  documentId: number | string;
  documentTitle: string;
  documentType?: string;
  onComplete?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentUrl,
  documentId,
  documentTitle,
  documentType = "pdf",
  onComplete,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { user, trackActivity } = useAuth();
  const { refreshCompletions } = useCompletion();

  // Format document URL correctly for offline use
  const formattedDocUrl = documentUrl.startsWith("http")
    ? documentUrl
    : `http://localhost:8080/uploads/${documentUrl}`;

  useEffect(() => {
    // Mark document as opened
    if (user && documentId) {
      trackActivity({
        userId: user.id || "user",
        type: "document_opened",
        resourceId: documentId.toString(),
        timestamp: new Date().toISOString(),
      });
    }

    // Save to user-specific localStorage that this document has been viewed
    const viewedDocuments = user
      ? userTrackingService.getUserData(`viewedDocuments`, {})
      : JSON.parse(localStorage.getItem("viewedDocuments") || "{}");

    viewedDocuments[documentId] = {
      lastViewed: new Date().toISOString(),
      progress: viewedDocuments[documentId]?.progress || 0,
      pageNumber: viewedDocuments[documentId]?.pageNumber || 1,
      completed: viewedDocuments[documentId]?.completed || false,
    };

    if (user) {
      userTrackingService.storeUserData(`viewedDocuments`, viewedDocuments);
    } else {
      localStorage.setItem("viewedDocuments", JSON.stringify(viewedDocuments));
    }

    // If there's a saved page number, go to it
    if (viewedDocuments[documentId]?.pageNumber) {
      setPageNumber(viewedDocuments[documentId].pageNumber);
    }
  }, [documentId, user, trackActivity]);

  useEffect(() => {
    // Update progress when page changes
    if (numPages) {
      const newProgress = Math.floor((pageNumber / numPages) * 100);
      setProgress(newProgress);

      // Save progress to user-specific localStorage
      const viewedDocuments = user
        ? userTrackingService.getUserData(`viewedDocuments`, {})
        : JSON.parse(localStorage.getItem("viewedDocuments") || "{}");

      if (viewedDocuments[documentId]) {
        viewedDocuments[documentId].progress = newProgress;
        viewedDocuments[documentId].pageNumber = pageNumber;

        // Check if document is completed (reached the last page)
        if (pageNumber === numPages && !viewedDocuments[documentId].completed) {
          viewedDocuments[documentId].completed = true;

          // Mark as completed using API
          if (user && documentId) {
            completionService
              .markComplete(
                typeof documentId === "string"
                  ? parseInt(documentId)
                  : documentId,
                "document",
                refreshCompletions
              )
              .then(() => {
                if (onComplete) onComplete();
              });

            trackActivity({
              userId: user.id || "user",
              type: "document_completed",
              resourceId: documentId.toString(),
              timestamp: new Date().toISOString(),
            });
          }
        }

        if (user) {
          userTrackingService.storeUserData(`viewedDocuments`, viewedDocuments);
        } else {
          localStorage.setItem(
            "viewedDocuments",
            JSON.stringify(viewedDocuments)
          );
        }
      }
    }
  }, [
    pageNumber,
    numPages,
    documentId,
    user,
    trackActivity,
    onComplete,
    refreshCompletions,
  ]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF Loaded successfully. Pages:", numPages);
    setNumPages(numPages);
    setLoading(false);
    setError(false);
    toast.success("Document loaded successfully");
  }

  function onDocumentLoadError(error: Error) {
    console.error("Document loading error:", error);
    setError(true);
    setLoading(false);
    toast.error("Failed to load document. Please check if the file exists.");
  }

  function changePage(offset: number) {
    const newPage = pageNumber + offset;
    if (newPage > 0 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
    }
  }

  function handleDownload() {
    try {
      // Create a temporary link to download the document
      const link = document.createElement("a");
      link.href = formattedDocUrl;
      link.download = documentTitle || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download
      if (user && documentId) {
        trackActivity({
          userId: user.id || "user",
          type: "document_downloaded",
          resourceId: documentId.toString(),
          timestamp: new Date().toISOString(),
        });
      }

      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.");
    }
  }

  // Get previously viewed indicator from user-specific storage
  const { isResourceCompleted } = useCompletion();
  const isCompleted = isResourceCompleted(documentId);

  function getFileTypeFromUrl(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return "unknown";

    if (["pdf"].includes(extension)) return "pdf";
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension))
      return "image";
    if (["doc", "docx"].includes(extension)) return "word";
    if (["mp4", "webm", "ogg", "avi", "mov"].includes(extension)) return "video";
    if (["txt", "rtf"].includes(extension)) return "text";

    return "unknown";
  }

  function renderDocumentContent() {
    console.log("Rendering document:", formattedDocUrl);

    const inferredType = getFileTypeFromUrl(formattedDocUrl);
    console.log("Document type:", inferredType);

    if (inferredType !== "pdf" && loading) {
      setLoading(false);
    }

    if (inferredType === "pdf") {
      return (
        <Document
          file={formattedDocUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
              <span className="ml-2">Loading PDF...</span>
            </div>
          }
          className="max-w-full"
          options={{
            cMapUrl: "/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "/standard_fonts/",
          }}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(600, window.innerWidth - 100)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-6 w-6 animate-spin text-mtech-primary" />
              </div>
            }
          />
        </Document>
      );
    }

    if (inferredType === "image") {
      return (
        <img
          src={formattedDocUrl}
          alt={documentTitle}
          className="max-h-[500px] mx-auto rounded-md"
          onError={(e) => {
            console.error("Image failed to load:", formattedDocUrl);
            setError(true);
          }}
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
        />
      );
    }

    if (inferredType === "video") {
      return (
        <video 
          controls 
          className="max-h-[500px] mx-auto rounded-md"
          onLoadedData={() => {
            setLoading(false);
            setError(false);
          }}
          onError={() => {
            console.error("Video failed to load:", formattedDocUrl);
            setError(true);
            setLoading(false);
          }}
        >
          <source src={formattedDocUrl} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // For unsupported types, show download option
    return (
      <div className="text-center p-6">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-4">
          {inferredType === "word" 
            ? "Word document preview not supported" 
            : "Preview not available for this file type"}
        </p>
        <Button onClick={handleDownload} className="mt-2">
          <Download className="mr-2 h-4 w-4" />
          Download {inferredType === "word" ? "Word Document" : "File"}
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{documentTitle}</CardTitle>
          {isCompleted && (
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Completed
            </div>
          )}
        </div>
        <CardDescription>
          {numPages
            ? `Page ${pageNumber} of ${numPages}`
            : "Loading document..."}
        </CardDescription>
        {numPages && <Progress value={progress} className="h-2" />}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center bg-gray-50 rounded-md min-h-[400px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Unable to display this document
              </p>
              <p className="text-sm text-gray-500 mb-4">
                The file might be corrupted, missing, or in an unsupported format
              </p>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Try Download Instead
              </Button>
              <Button 
                onClick={() => {
                  setError(false);
                  setLoading(true);
                  // Force reload
                  window.location.reload();
                }}
                variant="ghost"
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          ) : (
            renderDocumentContent()
          )}
        </div>
      </CardContent>
      {numPages && (
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1 || loading || error}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1) || loading || error}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentViewer;
