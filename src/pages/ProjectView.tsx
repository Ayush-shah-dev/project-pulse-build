import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectApplicationModal from "@/components/project/ProjectApplicationModal";
import { useAuth } from "@/contexts/AuthContext";
import ProjectViewLoading from "@/components/project/ProjectViewLoading";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import ProjectTeam from "@/components/project/ProjectTeam";
import ProjectResources from "@/components/project/ProjectResources";
import ProjectDetails from "@/components/project/ProjectDetails";
import { ArrowLeft, Users } from "lucide-react";

interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface Project {
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

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // owner can't apply to project
  const isOwner = user && project ? user.id === project.creator_id : false;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        const { data: projectData, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error || !projectData) {
          throw error || new Error("No data");
        }

        // get team owner profile (do not auto-generate avatar, just show letter fallback!)
        const { data: profileData } = await supabase
          .from('profile_details')
          .select('first_name, last_name, id')
          .eq('id', projectData.creator_id)
          .maybeSingle();

        const projectWithDetails = {
          ...projectData,
          members: profileData ? [{
            id: profileData.id,
            name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || "Anonymous User",
            // never auto-create avatar image, only show fallback
            avatar: undefined,
            role: "Project Owner"
          }] : [],
        };

        setProject(projectWithDetails);
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);

  const handleApply = async (answers: { why: string; experience: string; }) => {
    if (!project || !user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_applications").insert({
        project_id: project.id,
        applicant_id: user.id,
        message: `Why: ${answers.why}\nExperience: ${answers.experience}`,
        status: "pending"
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

  if (isLoading) return <ProjectViewLoading />;
  if (!project) return <ProjectNotFound />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/projects" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="w-full md:w-auto">
              <ProjectDetails project={project} />
            </div>
            {!isOwner && user && (
              <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Apply to Project
              </Button>
            )}
            {isOwner && (
              <Badge variant="outline" className="bg-primary/10 text-primary py-2 px-4">
                You are the owner of this project
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectDetails project={project} />
          </div>
          <div>
            <ProjectTeam members={project.members} />
            <ProjectResources />
          </div>
        </div>
        <ProjectApplicationModal
          open={showModal}
          onOpenChange={setShowModal}
          onSubmit={handleApply}
          loading={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default ProjectView;
