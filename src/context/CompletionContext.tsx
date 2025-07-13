
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCompletedResources } from '@/services/apiService';
import { useAuth } from './AuthContext';

interface CompletedResource {
  resourceId: number;
  type: 'video' | 'document' | 'quiz';
  completedAt: string;
  grade?: string;
  subject?: string;
}

interface CompletionContextType {
  completedResources: CompletedResource[];
  isLoading: boolean;
  refreshCompletions: () => Promise<void>;
  isResourceCompleted: (resourceId: number | string) => boolean;
  getCompletedBySubject: (subject: string) => CompletedResource[];
  getCompletedByType: (type: 'video' | 'document' | 'quiz', subject?: string) => CompletedResource[];
}

const CompletionContext = createContext<CompletionContextType | undefined>(undefined);

export const useCompletion = () => {
  const context = useContext(CompletionContext);
  if (!context) {
    throw new Error('useCompletion must be used within a CompletionProvider');
  }
  return context;
};

interface CompletionProviderProps {
  children: ReactNode;
}

export const CompletionProvider: React.FC<CompletionProviderProps> = ({ children }) => {
  const [completedResources, setCompletedResources] = useState<CompletedResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();


  const flattenNestedArrays = (obj: Record<string, any>) => {
  return Object.entries(obj)
    .flatMap(([type, nestedObj]) => {
      if (typeof nestedObj === 'object' && nestedObj !== null) {
        return Object.values(nestedObj).flat().map((item: any) => ({
          ...item,
          type: type.toLowerCase() 
        }));
      }
      return [];
    });
};


const refreshCompletions = async () => {
  if (!user) return;

  try {
    setIsLoading(true);
    const response = await getCompletedResources();
    console.log("test completed", response);

    // flatten all nested arrays inside DOCUMENT, VIDEO, QUIZ
    const allResources = flattenNestedArrays(response);

    const processed = allResources.map((item: any) => ({
      resourceId: item.resourceId || item.id,
      type: item.type,
      completedAt: item.completedAt || new Date().toISOString(),
      grade: item.grade,
      subject: item.subject,
    }));

    setCompletedResources(processed);
  } catch (error) {
    console.error('Failed to fetch completed resources:', error);
    const localCompleted = JSON.parse(localStorage.getItem('completedResources') || '[]');
    setCompletedResources(localCompleted);
  } finally {
    setIsLoading(false);
  }
};

  const isResourceCompleted = (resourceId: number | string) => {
    const id = typeof resourceId === 'string' ? parseInt(resourceId) : resourceId;
    

    return completedResources.some(resource => resource.resourceId === id);
  };

  const getCompletedBySubject = (subject: string) => {
    return completedResources.filter(resource => resource.subject === subject);
  };

  const getCompletedByType = (type: 'video' | 'document' | 'quiz', subject?: string) => {
    return completedResources.filter(resource => {
      const matchesType = resource.type === type;
      const matchesSubject = subject ? resource.subject === subject : true;
      return matchesType && matchesSubject;
    });
  };

  useEffect(() => {
    if (user) {
      refreshCompletions();
    }
  }, [user]);

  const value: CompletionContextType = {
    completedResources,
    isLoading,
    refreshCompletions,
    isResourceCompleted,
    getCompletedBySubject,
    getCompletedByType
  };

  return (
    <CompletionContext.Provider value={value}>
      {children}
    </CompletionContext.Provider>
  );
};
