
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Calendar } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  stage: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Props: projects, getStageColor, formatDate
const ProjectsListCard = ({
  projects,
  getStageColor,
  formatDate,
}: {
  projects: Project[];
  getStageColor: (stage: string) => string;
  formatDate: (dateString: string) => string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            Projects you've created or are managing
          </CardDescription>
        </div>
        <Button asChild>
          <Link to="/create-project" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start collaborating with others
            </p>
            <Button asChild>
              <Link to="/create-project" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row justify-between border rounded-lg p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge className={getStageColor(project.stage)}>
                      {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {project.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {formatDate(project.updated_at)}
                  </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/projects/${project.id}`}>
                      View Project
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {projects.length > 3 && (
        <CardFooter>
          <Button variant="ghost" asChild className="w-full">
            <Link to="/projects" className="flex items-center justify-center">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectsListCard;
