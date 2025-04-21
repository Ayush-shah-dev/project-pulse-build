
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export default function ProjectTeam({
  members,
}: {
  members: ProjectMember[] | undefined;
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Project Team</CardTitle>
      </CardHeader>
      <CardContent>
        {members && members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback>
                      {member.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  {member.role && (
                    <div className="text-sm text-muted-foreground">
                      {member.role}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No team members yet</p>
        )}
      </CardContent>
    </Card>
  );
}
