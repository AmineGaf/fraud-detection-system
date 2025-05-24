import { useParams } from "react-router-dom";
import { useExamsData, useUpdateExam } from "@/hooks/useExams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, FileText, Video, VideoOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FraudDetectionSession from "./FraudDetectionSession";
import type { FraudEvidence } from "@/types/exams";
import { useState } from "react";

export const ExamDetailsPage = () => {
  const { examId } = useParams();
  const { data: exams = [], refetch } = useExamsData();
  const { mutate: updateExam } = useUpdateExam();
  const navigate = useNavigate();
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);

  const exam = exams.find((e) => e.id === Number(examId));

  const handleFraudDetected = (data: FraudEvidence) => {
    updateExam({
      examId: Number(examId),
      examData: {
        fraud_status: "SUSPECTED",
        fraud_evidence: [...(exam?.fraud_evidence || []), data]
      }
    }, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  const handleSessionStart = () => {
    setIsMonitoringActive(true);
  };

  const handleSessionEnd = () => {
    setIsMonitoringActive(false);
    refetch();
  };

  const confirmFraud = () => {
    updateExam({
      examId: Number(examId),
      examData: { fraud_status: "CONFIRMED" }
    }, {
      onSuccess: () => refetch()
    });
  };

  const clearFraud = () => {
    updateExam({
      examId: Number(examId),
      examData: { fraud_status: null, fraud_evidence: [] }
    }, {
      onSuccess: () => refetch()
    });
  };

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="w-auto max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Exam not found</AlertTitle>
          <AlertDescription>
            The requested exam could not be found
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-in">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="gap-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exams
      </Button>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {exam.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-gray-50 border-gray-200">
                Class {exam.class_info.name}
              </Badge>
              <Badge 
                variant="outline" 
                className={
                  exam.status === "ongoing" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : exam.status === "upcoming"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                }
              >
                {exam.status.toLowerCase()}
              </Badge>
              {exam.fraud_status && (
                <Badge 
                  variant="outline" 
                  className={
                    exam.fraud_status === "CONFIRMED"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {exam.fraud_status.toLowerCase()}
                </Badge>
              )}
              {isMonitoringActive && (
                <Badge className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                  <Video className="h-3 w-3" />
                  <span>Monitoring Active</span>
                </Badge>
              )}
            </div>
          </div>

          {exam.fraud_status === "SUSPECTED" && (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={confirmFraud}
                className="gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Check className="h-4 w-4" />
                Confirm Fraud
              </Button>
              <Button 
                variant="outline" 
                onClick={clearFraud}
                className="gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <X className="h-4 w-4" />
                Dismiss Alert
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger 
              value="evidence" 
              disabled={!exam.fraud_evidence?.length}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Evidence {exam.fraud_evidence?.length ? `(${exam.fraud_evidence.length})` : ''}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Exam Information</CardTitle>
                  <CardDescription>Details about this examination</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{format(new Date(exam.exam_date), "PPpp")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">-- minutes</p>
                    </div>
                  </div>

                  {exam.fraud_status && (
                    <Alert 
                      variant={exam.fraud_status === "CONFIRMED" ? "destructive" : "default"}
                      className="border"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Fraud {exam.fraud_status === "CONFIRMED" ? "Confirmed" : "Suspected"}</AlertTitle>
                      <AlertDescription>
                        {exam.fraud_status === "CONFIRMED"
                          ? "Cheating has been confirmed by an administrator"
                          : "Suspicious activity detected - requires review"}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Exam Statistics</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">--</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="font-medium">--</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Fraud Detection</CardTitle>
                    <CardDescription>
                      {isMonitoringActive
                        ? "Live monitoring in progress"
                        : exam.fraud_status
                          ? "Previous detections"
                          : "No suspicious activity detected"}
                    </CardDescription>
                  </div>
                  {isMonitoringActive && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Video className="h-4 w-4" />
                      <span>Active</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FraudDetectionSession
                  exam={exam}
                  onFraudDetected={handleFraudDetected}
                  onSessionStart={handleSessionStart}
                  onSessionEnd={handleSessionEnd}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent key={exam.fraud_evidence?.length} value="evidence">
            {exam.fraud_evidence?.length ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Fraud Evidence</CardTitle>
                  <CardDescription>
                    {exam.fraud_evidence.length} incident(s) recorded
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {exam.fraud_evidence.map((evidence, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                          {format(new Date(evidence.timestamp), "PPpp")}
                        </span>
                      </div>
                      <img
                        src={evidence.screenshot}
                        alt={`Evidence ${index + 1}`}
                        className="rounded-md border w-full aspect-video object-cover shadow-inner"
                      />
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-foreground">Detections:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {evidence.detections.map((det, i) => (
                            <li key={i} className="text-muted-foreground">
                              {det.class_name} ({Math.round(det.confidence * 100)}%)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Alert className="border">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No evidence recorded</AlertTitle>
                <AlertDescription>
                  Start monitoring to capture potential fraud incidents.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};