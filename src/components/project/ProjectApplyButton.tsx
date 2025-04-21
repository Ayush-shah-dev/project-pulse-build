
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

  const handleSendMessage = async (message: string) => {
    if (!project || !user) return;
    setIsSubmitting(true);
    
    try {
      // Send a chat message directly
      const { error: messageError } = await supabase
        .from('project_chat_messages')
        .insert({
          project_id: project.id,
          sender_id: user.id,
          content: message
        });

      if (messageError) throw messageError;
      
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
    }
    setIsSubmitting(false);
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
      />
    </>
  );
}
