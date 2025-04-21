
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

export default function ProjectResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="#" className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2" />
            Project Website
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="#" className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2" />
            GitHub Repository
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
