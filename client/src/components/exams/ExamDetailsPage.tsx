import { useParams } from "react-router-dom";
import { useExamsData } from "@/hooks/useExams";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const ExamDetailsPage = () => {
  const { examId } = useParams();
  const { data: exams = [] } = useExamsData();
  const navigate = useNavigate();

  const exam = exams.find((e) => e.id === Number(examId));

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

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{exam.name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Class {exam.class_info.name}</Badge>
          <Badge>{exam.status.toLowerCase()}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Exam Details</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{format(new Date(exam.exam_date), "PPpp")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p> minutes</p>
            </div>
          </div>
        </div>

        {/* Add more exam details as needed */}
      </div>
    </div>
  );
};