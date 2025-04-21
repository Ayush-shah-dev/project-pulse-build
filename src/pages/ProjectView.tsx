
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProjectViewLoading from "@/components/project/ProjectViewLoading";
import ProjectNotFound from "@/components/project/ProjectNotFound";
import ProjectTeam from "@/components/project/ProjectTeam";
import ProjectResources from "@/components/project/ProjectResources";
import ProjectDetails from "@/components/project/ProjectDetails";
import { Badge } from "@/components/ui/badge";
import ProjectApplyButton from "@/components/project/ProjectApplyButton";
import { useProjectView } from "@/hooks/useProjectView";
import PendingApplications from "@/components/project/PendingApplications";

export default function ProjectView() {
  const { project, isLoading, user, isOwner, applications, refetch } = useProjectView();

  if (isLoading) return <ProjectViewLoading />;
  if (!project) return <ProjectNotFound />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/projects" className="flex items-center mb-6">
            <span>
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back to Projects
            </span>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="w-full md:w-auto">
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              {project.stage && (
                <Badge className="mr-2 capitalize">
                  {project.stage}
                </Badge>
              )}
              {project.category && (
                <Badge variant="outline">
                  {project.category}
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {!isOwner && user && (
                <ProjectApplyButton project={project} user={user} />
              )}
              {isOwner && (
                <Badge variant="outline" className="bg-primary/10 text-primary py-2 px-4">
                  You are the owner of this project
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectDetails project={project} />
            {isOwner && applications && applications.length > 0 && (
              <div className="mt-6">
                <PendingApplications 
                  applications={applications}
                  onApplicationUpdate={refetch}
                />
              </div>
            )}
          </div>
          <div>
            <ProjectTeam members={project.members || []} />
            <ProjectResources />
          </div>
        </div>
      </div>
    </Layout>
  );
}
