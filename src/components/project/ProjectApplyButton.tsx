
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
      // Step 1: Insert the application into the database
      const { data: applicationData, error } = await supabase
        .from("project_applications")
        .insert({
          project_id: project.id,
          applicant_id: user.id,
          message: `Why: ${answers.why}\nExperience: ${answers.experience}`,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log("Application submitted:", applicationData);
      
      // Step 2: Get the project owner's details
      const { data: projectOwner } = await supabase
        .from("profile_details")
        .select("id, first_name, last_name")
        .eq("id", project.creator_id)
        .maybeSingle();
        
      const { data: ownerEmail } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", project.creator_id)
        .maybeSingle();
      
      if (!ownerEmail?.email) {
        console.error("Could not find project owner's email");
        throw new Error("Could not find project owner's email");
      }
      
      // Step 3: Get the applicant details
      const { data: applicantProfile } = await supabase
        .from("profile_details")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();
      
      const applicantName = applicantProfile 
        ? `${applicantProfile.first_name || ""} ${applicantProfile.last_name || ""}`.trim() 
        : "A user";
        
      const ownerName = projectOwner 
        ? `${projectOwner.first_name || ""} ${projectOwner.last_name || ""}`.trim() 
        : "";
      
      // Step 4: Trigger the email notification
      const baseUrl = window.location.origin;
      console.log("Base URL for email links:", baseUrl);
      
      const emailResponse = await supabase.functions.invoke("send-project-application-email", {
        body: {
          applicantName,
          applicantEmail: user.email,
          projectId: project.id,
          projectTitle: project.title,
          applicationId: applicationData.id,
          ownerEmail: ownerEmail.email,
          ownerName,
          baseUrl,
        },
      });
      
      console.log("Email notification response:", emailResponse);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the project owner.",
        variant: "default",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Application submission error:", err);
      toast({
        title: "Failed to Submit",
        description: "There was an error submitting your application. Please try again.",
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
