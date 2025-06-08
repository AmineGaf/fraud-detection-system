import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, VideoIcon, SquareIcon, ScanEye, VideoOff } from "lucide-react";
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

      intervalRef.current = setInterval(captureAndAnalyzeFrame, 500);
    } catch (err) {
      setError("Unable to access webcam. Please check permissions.");
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

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    const base64Only = imageDataUrl.split(',')[1];

    try {
      const res = await fetch("http://localhost:8000/api/ai/detect/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_data: base64Only,
          exam_id: "test123"
        }),
      });

      const result = await res.json();
      if (result.is_fraud) {
        const evidence: FraudEvidence = {
          examId: exam.id,
          timestamp: new Date().toISOString(),
          screenshot: imageDataUrl,
          detections: result.detections,
        };
        onFraudDetected(evidence);
      }
    } catch (err) {
      setError("Error sending data to detection service.");
    }
  };



  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button
          onClick={isMonitoring ? stopSession : startSession}
          className="gap-2 shadow-sm hover:shadow-md transition-shadow"
        >
          {isMonitoring ? (
            <>
              <SquareIcon className="w-4 h-4" />
              Stop Monitoring
            </>
          ) : (
            <>
              <VideoIcon className="w-4 h-4" />
              Start Monitoring
            </>
          )}
        </Button>

        {isMonitoring && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm">
            <ScanEye className="h-4 w-4 animate-pulse" />
            <span>Analyzing every 1 seconds</span>
          </div>
        )}
      </div>

      <div className="relative rounded-xl border bg-muted/20 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          autoPlay
          muted
          playsInline
        />
        {!isMonitoring && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <div className="text-center p-6 bg-black/70 rounded-lg">
              <VideoOff className="h-10 w-10 mx-auto mb-3" />
              <h3 className="font-medium text-lg">Monitoring Inactive</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Click "Start Monitoring" to begin fraud detection
              </p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FraudDetectionSession;