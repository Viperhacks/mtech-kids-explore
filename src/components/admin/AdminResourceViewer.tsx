import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Video, FileText, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AdminResource } from '../types/adminTypes';
import DocumentViewer from '../DocumentViewer';
import { capitalize } from '@/utils/stringUtils';
import toReadableDate from '@/utils/toReadableDate';

interface AdminResourceViewerProps {
  resource: AdminResource;
  onClose?: () => void;
}

const AdminResourceViewer: React.FC<AdminResourceViewerProps> = ({ resource, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { response } = resource;
  const isVideo = response.type === 'video';
  const isDocument = response.type === 'document';

  // Format content URL
  const contentUrl = response.content.startsWith('http') 
    ? response.content 
    : `http://localhost:8080/uploads/${response.content}`;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = contentUrl;
    link.download = response.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Resource Metadata */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isVideo ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              {capitalize(response.title)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {isVideo ? 'Video' : 'Document'}
              </Badge>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Grade:</span> {response.grade}
            </div>
            <div>
              <span className="font-medium">Subject:</span> {capitalize(response.subject)}
            </div>
            <div>
              <span className="font-medium">Teacher:</span> {response.teacher}
            </div>
            <div>
              <span className="font-medium">Created:</span> {toReadableDate(response.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Viewer */}
      {isVideo && (
        <Card>
          <CardHeader>
            <CardTitle>Video Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={contentUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="ghost" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-white text-xs min-w-[40px]">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white text-xs min-w-[40px]">
                      {formatTime(duration)}
                    </span>
                  </div>
                  
                  <Button size="sm" variant="ghost" onClick={handleMuteToggle} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isDocument && (
        <DocumentViewer
          documentUrl={contentUrl}
          documentId={response.id}
          documentTitle={response.title}
          documentType="pdf"
        />
      )}
    </div>
  );
};

export default AdminResourceViewer;