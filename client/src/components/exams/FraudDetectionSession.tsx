import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, VideoIcon, SquareIcon } from "lucide-react";
import type { Exam, FraudEvidence } from "@/types/exams";

interface FraudDetectionSessionProps {
  exam: Exam;
  onFraudDetected: (evidence: FraudEvidence) => void;
  onSessionStart: () => void;
  onSessionEnd: () => void;
}

const FraudDetectionSession: React.FC<FraudDetectionSessionProps> = ({
  exam,
  onFraudDetected,
  onSessionStart,
  onSessionEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsMonitoring(true);
      onSessionStart();

      intervalRef.current = setInterval(captureAndAnalyzeFrame, 5000);
    } catch (err) {
      setError("Unable to access webcam.");
    }
  };

  const stopSession = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsMonitoring(false);
    onSessionEnd();
  };

  const captureAndAnalyzeFrame = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");

    console.log("imageDataUrl :", imageDataUrl)
    try {
      const res = await fetch("http://localhost:8000/api/ai/detect/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_data: imageDataUrl,
          exam_id: "test123"
        }),
      });


      const result = await res.json();
      if (result.is_fraud) {
        const evidence: FraudEvidence = {
          timestamp: new Date().toISOString(),
          screenshot: imageDataUrl,
          detections: result.detections,
        };
        onFraudDetected(evidence);
      }
    } catch (err) {
      setError("Error sending data to server.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <Button onClick={isMonitoring ? stopSession : startSession}>
          {isMonitoring ? (
            <>
              <SquareIcon className="w-4 h-4 mr-2" />
              Stop Monitoring
            </>
          ) : (
            <>
              <VideoIcon className="w-4 h-4 mr-2" />
              Start Monitoring
            </>
          )}
        </Button>
      </div>

      <video ref={videoRef} className="w-full rounded-md border" autoPlay muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FraudDetectionSession;
