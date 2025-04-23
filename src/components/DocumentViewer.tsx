
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

  // Format document URL correctly
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

    // Save to local storage that this document has been viewed
    const viewedDocuments = JSON.parse(localStorage.getItem("viewedDocuments") || "{}");
    viewedDocuments[documentId] = {
      lastViewed: new Date().toISOString(),
      progress: viewedDocuments[documentId]?.progress || 0,
      pageNumber: viewedDocuments[documentId]?.pageNumber || 1,
      completed: viewedDocuments[documentId]?.completed || false,
    };
    localStorage.setItem("viewedDocuments", JSON.stringify(viewedDocuments));

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

      // Save progress to local storage
      const viewedDocuments = JSON.parse(localStorage.getItem("viewedDocuments") || "{}");
      if (viewedDocuments[documentId]) {
        viewedDocuments[documentId].progress = newProgress;
        viewedDocuments[documentId].pageNumber = pageNumber;
        
        // Check if document is completed (reached the last page)
        if (pageNumber === numPages && !viewedDocuments[documentId].completed) {
          viewedDocuments[documentId].completed = true;
        
          if (user && documentId && onComplete) {
            trackActivity({
              userId: user.id || "user",
              type: "document_completed",
              resourceId: documentId.toString(),
              timestamp: new Date().toISOString(),
            });
            onComplete();
          }
        
          toast.success("Document completed!");
        }
        
        
        localStorage.setItem("viewedDocuments", JSON.stringify(viewedDocuments));
      }
    }
  }, [pageNumber, numPages, documentId, user, trackActivity, onComplete]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    
    toast.success("Document loaded successfully");
  }

  function onDocumentLoadError(error: Error) {
    console.error("Document loading error:", error);
    setError(true);
    setLoading(false);
    
    toast.error("Failed to load document");
  }

  function changePage(offset: number) {
    const newPage = pageNumber + offset;
    if (newPage > 0 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
    }
  }

  function handleDownload() {
    // Create a temporary link to download the document
    const link = document.createElement("a");
    link.href = formattedDocUrl;
    link.download = documentTitle || "document";
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
  }

  // Get previously viewed indicator
  const viewedDocuments = JSON.parse(localStorage.getItem("viewedDocuments") || "{}");
  const isCompleted = viewedDocuments[documentId]?.completed || false;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{documentTitle}</CardTitle>
          {isCompleted && (
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Completed
            </div>
          )}
        </div>
        <CardDescription>
          {numPages ? `${pageNumber} of ${numPages} pages` : "Loading document..."}
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-center bg-gray-100 rounded-md min-h-[400px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
            </div>
          )}
          
          {error ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-semibold text-gray-700">
                Unable to display this document
              </p>
              <p className="text-sm text-gray-500 mb-4">
                The document may be in a format we can't preview
              </p>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Instead
              </Button>
            </div>
          ) : (
            <Document
              file={formattedDocUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-mtech-primary" />
                </div>
              }
              className="max-w-full"
            >
              <Page 
                pageNumber={pageNumber} 
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </div>
      </CardContent>
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
    </Card>
  );
};

export default DocumentViewer;
