import { useParams } from "react-router-dom";
import { useExamsData, useUpdateExam } from "@/hooks/useExams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import FraudDetectionSession from "./FraudDetectionSession";
import type { FraudEvidence } from "@/types/exams";

export const ExamDetailsPage = () => {
  const { examId } = useParams();
  const { data: exams = [], refetch } = useExamsData();
  const { mutate: updateExam } = useUpdateExam();
  const navigate = useNavigate();

  const exam = exams.find((e) => e.id === Number(examId));

  const handleFraudDetected = (data: FraudEvidence) => {
    updateExam({
      examId: Number(examId),
      examData: {
        fraud_status: "SUSPECTED",
        fraud_evidence: [...(exam?.fraud_evidence || []), data]
      }
    }, {
      onSuccess: () => refetch()
    });
  };

  const handleSessionEnd = () => {
    console.log("Detection session ended");
  };

  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exams
      </Button>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{exam.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Class {exam.class_info.name}</Badge>
              <Badge>{exam.status.toLowerCase()}</Badge>
              {exam.fraud_status && (
                <Badge variant="destructive">{exam.fraud_status.toLowerCase()}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exam Information</CardTitle>
              <CardDescription>Details about this examination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{format(new Date(exam.exam_date), "PPpp")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p>-- minutes</p>
                </div>
              </div>

              {exam.fraud_status && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Fraud Alert</AlertTitle>
                  <AlertDescription>
                    {exam.fraud_status === "CONFIRMED"
                      ? "Confirmed cheating incident"
                      : "Suspicious activity detected"}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
              <CardDescription>
                {exam.fraud_status
                  ? "Monitoring system"
                  : "No suspicious activity detected"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FraudDetectionSession
                exam={exam}
                onFraudDetected={handleFraudDetected}
                onSessionEnd={handleSessionEnd}
              />
            </CardContent>
          </Card>

          {exam.fraud_evidence && exam.fraud_evidence.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Fraud Evidence</CardTitle>
                <CardDescription>
                  {exam.fraud_evidence?.length} incident(s) recorded
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exam.fraud_evidence.map((evidence, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>
                        {format(new Date(evidence.timestamp), "PPpp")}
                      </span>
                    </div>
                    <img
                      src={evidence.screenshot}
                      alt={`Evidence ${index + 1}`}
                      className="rounded-md border"
                    />
                    <div className="text-sm">
                      <p>Detections: {evidence.detections.length}</p>
                      <p>Highest confidence: {
                        Math.max(...evidence.detections.map(d => d.confidence)) * 100
                      }%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};