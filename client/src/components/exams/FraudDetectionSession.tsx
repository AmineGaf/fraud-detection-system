import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { VideoIcon, SquareIcon, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Exam } from '@/types/exams';

interface DetectionResult {
  detections: Array<{
    class_id: number;
    class_name: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
  is_fraud: boolean;
  timestamp?: string;
  error?: string;
}

interface FraudDetectionSessionProps {
  exam: Exam;
  onFraudDetected: (data: any) => void;
  onSessionEnd: () => void;
}

const FraudDetectionSession: React.FC<FraudDetectionSessionProps> = ({ 
  exam, 
  onFraudDetected, 
  onSessionEnd 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [fraudDetected, setFraudDetected] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSession = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onplaying = () => setIsRecording(true);
      }
      
      setStream(mediaStream);
      const id = setInterval(captureAndDetect, 2000);
      setIntervalId(id);
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Error accessing webcam:', err);
    }
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    try {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      
      const response = await fetch('http://localhost:8000/api/ai/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_data: imageData.split(',')[1],
          exam_id: exam.id 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DetectionResult = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.is_fraud) {
        setFraudDetected(true);
        setScreenshots(prev => [...prev, imageData]);
        onFraudDetected({
          examId: exam.id,
          screenshot: imageData,
          detections: result.detections,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(`Detection error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Detection error:', err);
    }
  };

  const stopSession = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    onSessionEnd();
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-md overflow-hidden border">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            Camera is off
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isRecording ? (
          <Button onClick={startSession} className="gap-2">
            <VideoIcon className="h-4 w-4" />
            Start Monitoring
          </Button>
        ) : (
          <Button 
            onClick={stopSession} 
            variant="destructive"
            className="gap-2"
          >
            <SquareIcon className="h-4 w-4" />
            Stop Monitoring
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fraudDetected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fraud Detected!</AlertTitle>
          <AlertDescription>
            Suspicious activity has been recorded and reported.
          </AlertDescription>
        </Alert>
      )}

      {screenshots.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Evidence</h4>
          <div className="flex gap-2 overflow-x-auto">
            {screenshots.map((screenshot, index) => (
              <img 
                key={index}
                src={screenshot}
                alt={`Evidence ${index + 1}`}
                className="h-24 rounded-md border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetectionSession;