
import { useProjectNotifications } from "@/hooks/useProjectNotifications";
import ProjectNotificationsCard from "./ProjectNotificationsCard";

interface ProjectNotificationsProps {
  userId: string;
}

const ProjectNotifications = ({ userId }: ProjectNotificationsProps) => {
  const {
    applications,
    isLoading,
    updateApplicationStatus,
  } = useProjectNotifications(userId);

  const handleAccept = (id: string) => updateApplicationStatus(id, "accepted");
  const handleReject = (id: string) => updateApplicationStatus(id, "rejected");

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
