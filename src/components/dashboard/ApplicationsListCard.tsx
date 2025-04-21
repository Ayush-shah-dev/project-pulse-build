
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface Application {
  id: string;
  project_id: string;
  status: string;
  created_at: string;
  project: {
    title: string;
  };
}

const ApplicationsListCard = ({
  applications,
  getStatusColor,
  formatDate,
}: {
  applications: Application[];
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Applications</CardTitle>
        <CardDescription>
          Projects you've applied to join
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Browse projects and apply to start collaborating
            </p>
            <Button asChild>
              <Link to="/projects">
                Browse Projects
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <div className="font-medium mb-1">{application.project.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Applied on {formatDate(application.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {application.status === "accepted" && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/projects/${application.project_id}`}>
                      View Project
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsListCard;
