
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2 } from "lucide-react";
import ProjectApplicationNotificationItem from "./ProjectApplicationNotificationItem";
import type { ProjectApplication } from "@/hooks/useProjectNotifications";

interface Props {
  applications: ProjectApplication[];
  isLoading: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const ProjectNotificationsCard = ({
  applications,
  isLoading,
  onAccept,
  onReject,
}: Props) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Project Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Project Applications
          {applications.length > 0 && (
            <Badge className="ml-2 bg-primary">{applications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((application) => (
          <ProjectApplicationNotificationItem
            key={application.id}
            application={application}
            onAccept={() => onAccept(application.id)}
            onReject={() => onReject(application.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectNotificationsCard;
