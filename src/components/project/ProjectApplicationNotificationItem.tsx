
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";
import type { ProjectApplication } from "@/hooks/useProjectNotifications";

interface Props {
  application: ProjectApplication;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

const ProjectApplicationNotificationItem = ({
  application,
  onAccept,
  onReject,
}: Props) => {
  const applicantName =
    `${application.applicant.first_name || ""} ${application.applicant.last_name || ""}`.trim() ||
    "Anonymous User";

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.applicant.id}`}
              alt={applicantName}
            />
            <AvatarFallback>{applicantName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{applicantName}</div>
            <div className="text-sm text-muted-foreground">
              Applied to{" "}
              <Link
                to={`/projects/${application.project_id}`}
                className="font-medium hover:underline"
              >
                {application.project.title}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-green-600"
            onClick={() => onAccept(application.id)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 text-red-600"
            onClick={() => onReject(application.id)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="bg-muted/50 rounded-md p-3 text-sm whitespace-pre-line">
        {application.message}
      </div>
    </div>
  );
};

export default ProjectApplicationNotificationItem;
