
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, Users, BookOpen } from "lucide-react";

const QuickActionsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/projects" className="flex items-center">
            <Rocket className="mr-2 h-4 w-4" />
            Browse Projects
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/discover" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Find Collaborators
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/resources" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Learning Resources
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
