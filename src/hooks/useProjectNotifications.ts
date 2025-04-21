
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Applicant {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  project: {
    title: string;
  };
  applicant: Applicant;
}

export function useProjectNotifications(userId: string) {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id")
          .eq("creator_id", userId);

        if (projectsError) throw projectsError;

        if (projects && projects.length > 0) {
          const projectIds = projects.map((project) => project.id);

          const { data, error } = await supabase
            .from("project_applications")
            .select(`
              id, 
              project_id, 
              applicant_id, 
              message, 
              status, 
              created_at,
              updated_at
            `)
            .in("project_id", projectIds)
            .eq("status", "pending")
            .order("created_at", { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            const completeApplications: ProjectApplication[] = [];
            for (const app of data) {
              const { data: projectData, error: projectError } = await supabase
                .from("projects")
                .select("title")
                .eq("id", app.project_id)
                .single();
              if (projectError) continue;
              const { data: applicantData, error: applicantError } = await supabase
                .from("profile_details")
                .select("id, first_name, last_name")
                .eq("id", app.applicant_id)
                .single();
              if (applicantError) continue;
              completeApplications.push({
                ...app,
                project: { title: projectData.title },
                applicant: applicantData
              });
            }
            setApplications(completeApplications);
          } else {
            setApplications([]);
          }
        } else {
          setApplications([]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load application notifications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchApplications();
  }, [userId, toast]);

  const updateApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    try {
      const { error } = await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;

      setApplications((prev) =>
        prev.filter((application) => application.id !== applicationId)
      );

      toast({
        title: status === "accepted" ? "Application Accepted" : "Application Rejected",
        description:
          status === "accepted"
            ? "The applicant has been notified of your decision"
            : "The applicant will be notified of your decision",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  return { applications, isLoading, updateApplicationStatus };
}
