
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

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
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function getStageColor(stage: string) {
  const normalizedStage = stage.toLowerCase();
  switch (normalizedStage) {
    case "idea":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "prototype":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "mvp":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "launched":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function ProjectDetails({
  project,
}: {
  project: Project;
}) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getStageColor(project.stage)}>
            {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
          </Badge>
          {project.category && (
            <Badge variant="outline">{project.category}</Badge>
          )}
          <span className="text-sm text-muted-foreground">
            <Calendar className="inline h-3 w-3 mr-1" />
            Created {formatDate(project.created_at)}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.description}</p>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags &&
                    project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Roles Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.roles_needed?.length > 0 ? (
                  project.roles_needed.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="bg-brand-purple/5 border-brand-purple/20 text-brand-purple px-3 py-1"
                    >
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No specific roles listed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-12 text-center">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Discussions Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This feature is currently being developed. Check back later!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-12 text-center">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Task Management Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Project tasks and management tools will be available soon!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
