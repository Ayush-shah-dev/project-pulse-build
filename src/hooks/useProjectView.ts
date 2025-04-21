import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: string;
  roles_needed: string[];
  category: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  members?: ProjectMember[];
}

export interface ProjectApplication {
  id: string;
  message: string;
  status: string;
  created_at: string;
  applicant: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export function useProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProjectAndApplications = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !projectData) {
        throw error || new Error("No data");
      }

      const { data: profileData } = await supabase
        .from("profile_details")
        .select("first_name, last_name, id")
        .eq("id", projectData.creator_id)
        .maybeSingle();

      const projectWithDetails: Project = {
        ...projectData,
        members: profileData ? [
          {
            id: profileData.id,
            name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || "Anonymous User",
            role: "Project Owner",
          },
        ] : [],
      };

      setProject(projectWithDetails);

      if (user && user.id === projectData.creator_id) {
        console.log("Fetching pending applications for project:", id);
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("project_applications")
          .select(`
            id,
            message,
            status,
            created_at,
            applicant_id,
            applicant:profile_details(id, first_name, last_name)
          `)
          .eq("project_id", id)
          .eq("status", "pending");

        if (applicationsError) {
          console.error("Error fetching applications:", applicationsError);
          throw applicationsError;
        }

        console.log("Found applications:", applicationsData);
        setApplications(applicationsData || []);
      }

    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndApplications();
  }, [id, toast, user]);

  const isOwner = user && project ? user.id === project.creator_id : false;

  return { id, project, setProject, isLoading, user, isOwner, applications, refetch: fetchProjectAndApplications };
}
