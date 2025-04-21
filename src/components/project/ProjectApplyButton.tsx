
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import ProjectApplicationModal from "@/components/project/ProjectApplicationModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

  const handleApply = async (answers: { why: string; experience: string }) => {
    if (!project || !user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_applications").insert({
        project_id: project.id,
        applicant_id: user.id,
        message: `Why: ${answers.why}\nExperience: ${answers.experience}`,
        status: "pending",
      });
      if (error) throw error;
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the project owner.",
        variant: "default",
      });
      setShowModal(false);
    } catch (err) {
      toast({
        title: "Failed to Submit",
        description: "There was an error submitting your application.",
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
        <Users className="h-4 w-4" />
        Apply to Project
      </Button>
      <ProjectApplicationModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleApply}
        loading={isSubmitting}
      />
    </>
  );
}
