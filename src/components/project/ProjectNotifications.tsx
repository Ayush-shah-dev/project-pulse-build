
import { useState } from "react";
import { useProjectNotifications } from "@/hooks/useProjectNotifications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProjectNotificationsCard from "./ProjectNotificationsCard";

interface ProjectNotificationsProps {
  userId: string;
}

const ProjectNotifications = ({ userId }: ProjectNotificationsProps) => {
  const {
    applications,
    isLoading,
    updateApplicationStatus,
    refetchApplications,
  } = useProjectNotifications(userId);
  const { toast } = useToast();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Add debug logs to see what's happening
  console.log("ProjectNotifications rendering with:", { 
    userId, 
    applicationsCount: applications?.length || 0,
    applications,
    isLoading 
  });

  const handleAccept = async (id: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(id));
      console.log("Accepting application:", id);
      await updateApplicationStatus(id, "accepted");

      // Enable direct chat by triggering the edge function
      await supabase.functions.invoke("notify-applicant", {
        body: {
          applicationId: id,
          status: "accepted",
          enableChat: true
        },
      });
      
      toast({
        title: "Application Accepted",
        description: "The applicant has been notified and chat has been enabled",
      });
      
      // Explicitly refetch applications after accepting
      refetchApplications();
    } catch (err) {
      console.error("Error accepting application:", err);
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(id));
      console.log("Rejecting application:", id);
      await updateApplicationStatus(id, "rejected");

      // Notify the applicant via email
      await supabase.functions.invoke("notify-applicant", {
        body: {
          applicationId: id,
          status: "rejected",
          enableChat: false
        },
      });
      
      toast({
        title: "Application Rejected",
        description: "The applicant has been notified of your decision",
      });
      
      // Explicitly refetch applications after rejecting
      refetchApplications();
    } catch (err) {
      console.error("Error rejecting application:", err);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  return (
    <ProjectNotificationsCard
      applications={applications}
      isLoading={isLoading}
      onAccept={handleAccept}
      onReject={handleReject}
      processingIds={processingIds}
    />
  );
};

export default ProjectNotifications;
