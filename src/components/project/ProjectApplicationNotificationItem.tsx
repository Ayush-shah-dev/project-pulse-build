
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ProjectApplication } from "@/hooks/useProjectNotifications";

interface Props {
  application: ProjectApplication;
  onAccept: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}

const ProjectApplicationNotificationItem = ({ 
  application, 
  onAccept, 
  onReject,
  isProcessing = false
}: Props) => {
  const { project, applicant } = application;
  const applicantName = applicant.first_name && applicant.last_name
    ? `${applicant.first_name} ${applicant.last_name}`
    : "A user";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {applicantName} applied to "{project.title}"
        </CardTitle>
        <CardDescription>
          Received {new Date(application.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Alert variant="default" className="bg-muted/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {application.message}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {isProcessing ? (
          <Button disabled className="w-20">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Wait...
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={onAccept}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectApplicationNotificationItem;
