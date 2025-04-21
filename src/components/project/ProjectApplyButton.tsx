
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DirectMessageModal from "./DirectMessageModal";
import type { Project } from "@/hooks/useProjectView";

interface ProjectApplyButtonProps {
  project: Project;
  user: any;
  disabled?: boolean;
}

export default function ProjectApplyButton({
  project,
  user,
  disabled,
}: ProjectApplyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Don't display the button if the user is not logged in or is the project owner
  if (!user || !project) {
    return null;
  }

  // Check if this is the owner of the project
  const isOwner = user.id === project.creator_id;
  if (isOwner) {
    return null;
  }

  const handleSendMessage = async (message: string) => {
    if (!project || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to contact project owners.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Sending message to project owner", {
      projectId: project.id,
      senderId: user.id,
      message: message
    });
    
    setIsSubmitting(true);
    
    try {
      // Send a chat message directly
      const { error } = await supabase
        .from('project_chat_messages')
        .insert({
          project_id: project.id,
          sender_id: user.id,
          content: message
        });

      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the project owner.",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Failed to Send",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
        disabled={disabled}
      >
        <Mail className="h-4 w-4" />
        Contact Project Owner
      </Button>
      <DirectMessageModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleSendMessage}
        loading={isSubmitting}
        projectTitle={project.title}
      />
    </>
  );
}
