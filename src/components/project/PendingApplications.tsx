
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { ProjectApplication } from "@/hooks/useProjectView";

interface Props {
  applications: ProjectApplication[];
  onApplicationUpdate: () => void;
}

export default function PendingApplications({ applications, onApplicationUpdate }: Props) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleAccept = async (applicationId: string, applicantId: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(applicationId));

      // Initialize chat and update application status
      const { data, error: chatError } = await supabase.functions.invoke("project-chat-init", {
        body: {
          applicationId,
          applicantId
        },
      });

      if (chatError) throw chatError;

      // Update application status
      const { error: updateError } = await supabase
        .from("project_applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      toast({
        title: "Application Accepted",
        description: "The applicant has been notified and chat has been enabled",
      });

      onApplicationUpdate();
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(applicationId);
        return updated;
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(applicationId));

      const { error } = await supabase
        .from("project_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The applicant has been notified",
      });

      onApplicationUpdate();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(applicationId);
        return updated;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Applications ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No pending applications for this project.
          </p>
        ) : (
          applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium">
                      {application.applicant.first_name} {application.applicant.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{application.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {processingIds.has(application.id) ? (
                      <Button disabled>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Processing...
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(application.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccept(application.id, application.applicant.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
