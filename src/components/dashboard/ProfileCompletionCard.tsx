
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProfileCompletionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your profile is 70% complete. Add more details to increase your chances of finding collaborators.
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link to="/profile">Complete Your Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProfileCompletionCard;
