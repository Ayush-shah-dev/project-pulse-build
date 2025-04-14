
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import SkillBadge from "./SkillBadge";
import { Link } from "react-router-dom";

interface UserCardProps {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  skills: string[];
  matchScore?: number;
  location?: string;
}

const UserCard = ({ 
  id,
  name,
  avatar,
  title,
  skills,
  matchScore,
  location
}: UserCardProps) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
                {location && (
                  <p className="text-xs text-muted-foreground mt-1">{location}</p>
                )}
              </div>
              {matchScore && (
                <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
                  {matchScore}% Match
                </Badge>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {skills.slice(0, 4).map(skill => (
                <SkillBadge key={skill} name={skill} />
              ))}
              {skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-3 flex justify-between">
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link to={`/profile/${id}`}>View Profile</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
