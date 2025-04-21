
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RecommendedProjectsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=project1" />
            <AvatarFallback>RP</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">React Portfolio Builder</div>
            <div className="text-sm text-muted-foreground">Looking for UI/UX Designer</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=project2" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">AI Content Generator</div>
            <div className="text-sm text-muted-foreground">Needs Backend Developer</div>
          </div>
        </div>
        <Button variant="ghost" asChild className="w-full">
          <Link to="/projects" className="flex items-center justify-center">
            View More Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendedProjectsCard;
