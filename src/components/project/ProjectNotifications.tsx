
import { useState, useEffect } from "react";
import { useProjectNotifications } from "@/hooks/useProjectNotifications";
import { useToast } from "@/hooks/use-toast";
import ProjectNotificationsCard from "./ProjectNotificationsCard";

interface ProjectNotificationsProps {
  userId: string;
}

const ProjectNotifications = ({ userId }: ProjectNotificationsProps) => {
  const [error, setError] = useState<string | null>(null);
  const {
    applications,
    isLoading,
    updateApplicationStatus,
  } = useProjectNotifications(userId);
  const { toast } = useToast();

  useEffect(() => {
    // Add diagnostic logging
    console.log("ProjectNotifications rendered with userId:", userId);
    console.log("Current applications:", applications);
    
    if (applications.length === 0 && !isLoading) {
      console.log("No applications found for user projects");
    }
  }, [userId, applications, isLoading]);

  const handleAccept = async (id: string) => {
    try {
      console.log("Accepting application:", id);
      await updateApplicationStatus(id, "accepted");
      toast({
        title: "Application Accepted",
        description: "The applicant has been notified of your decision",
      });
    } catch (err) {
      console.error("Error accepting application:", err);
      setError("Failed to accept application. Please try again.");
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      console.log("Rejecting application:", id);
      await updateApplicationStatus(id, "rejected");
      toast({
        title: "Application Rejected",
        description: "The applicant has been notified of your decision",
      });
    } catch (err) {
      console.error("Error rejecting application:", err);
      setError("Failed to reject application. Please try again.");
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProjectNotificationsCard
      applications={applications}
      isLoading={isLoading}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default ProjectNotifications;
