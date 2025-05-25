import { 
    Activity, 
    BookOpen, 
    Clock, 
    Eye, 
    FileText, 
    Users as UsersIcon 
  } from "lucide-react";
  import { useExamsData } from "@/hooks/useExams";
  import { useClassesData } from "@/hooks/useClasses";
  import { useUsersData } from "@/hooks/useUsers";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { useNavigate } from "react-router-dom";
  import { formatDistanceToNow } from "date-fns";
import type { User } from "@/types/users";
  
  export const Dashboard = () => {
    const { data: exams = [] } = useExamsData();
    const { data: classes = [] } = useClassesData();
    const { data: users = [] } = useUsersData();
    const navigate = useNavigate();
  
    // Filter data for dashboard metrics
    const activeExams = exams.filter(e => e.status === "ongoing");
    const upcomingExams = exams.filter(e => e.status === "upcoming");
    const recentExams = [...exams]
      .sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime())
      .slice(0, 3);
  
    return (
      <div className="space-y-6 animate-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Key metrics and recent activity
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/exams")}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Exams
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/classes")}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Classes
            </Button>
          </div>
        </div>
  
        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Exams
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeExams.length} active, {upcomingExams.length} upcoming
              </p>
            </CardContent>
          </Card>
  
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Classes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {classes.filter(c => c.is_active).length} active
              </p>
            </CardContent>
          </Card>
  
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {users.filter((u: User) => u.role.id === 2).length} professors
              </p>
            </CardContent>
          </Card>
  
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fraud Detections
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exams.filter(e => e.fraud_status).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {exams.filter(e => e.fraud_status === "CONFIRMED").length} confirmed
              </p>
            </CardContent>
          </Card>
        </div>
  
        {/* Recent Activity Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Recent Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.length > 0 ? (
                  recentExams.map((exam) => (
                    <div 
                      key={exam.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 cursor-pointer"
                      onClick={() => navigate(`/exams/${exam.id}`)}
                    >
                      <div>
                        <div className="font-medium">{exam.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(exam.exam_date), { addSuffix: true })}
                        </div>
                      </div>
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
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent exams found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
  
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">System Operational</div>
                    <div className="text-sm text-muted-foreground">
                      All services are running normally
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Upcoming Maintenance</div>
                    <div className="text-sm text-muted-foreground">
                      Scheduled for next weekend
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Fraud Detection Active</div>
                    <div className="text-sm text-muted-foreground">
                      Monitoring {activeExams.length} exams
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };