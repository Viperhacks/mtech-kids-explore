import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminResource, AdminQuiz } from '../types/adminTypes';
import AdminResourceViewer from './AdminResourceViewer';
import AdminQuizViewer from './AdminQuizViewer';

interface AdminPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: AdminResource | AdminQuiz | null;
  type: 'resource' | 'quiz';
}

const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  open,
  onOpenChange,
  content,
  type
}) => {
  if (!content) return null;

  const getTitle = () => {
    if (type === 'resource') {
      const resource = content as AdminResource;
      return `${resource.response.type === 'video' ? 'Video' : 'Document'}: ${resource.response.title}`;
    } else {
      const quiz = content as AdminQuiz;
      return `Quiz: ${quiz.title}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {type === 'resource' ? (
            <AdminResourceViewer 
              resource={content as AdminResource}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <AdminQuizViewer 
              quiz={content as AdminQuiz}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPreviewModal;