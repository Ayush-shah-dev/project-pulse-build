
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Users } from "lucide-react";
import ProjectApplicationModal from "./ProjectApplicationModal";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectMember {
  id: string;
  name: string;
  avatar?: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stage: string;
  members?: ProjectMember[];
  rolesNeeded?: string[];
  matchScore?: number;
  updatedAt: string;
}

const ProjectCard = ({
  id,
  title,
  description,
  tags,
  stage,
  members = [],
  rolesNeeded,
  matchScore,
  updatedAt
}: ProjectCardProps) => {
  const getStageColor = () => {
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
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleApply = async (answers: { why: string; experience: string; }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_applications").insert({
        project_id: id,
        applicant_id: user?.id,
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            <Badge className={getStageColor()}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </Badge>
            {matchScore && (
              <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
                {matchScore}% Match
              </Badge>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="mt-4 flex flex-wrap gap-1">
          {tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 4} more
            </Badge>
          )}
        </div>

        {rolesNeeded && rolesNeeded.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Roles Needed:</h4>
            <div className="flex flex-wrap gap-1">
              {rolesNeeded.map(role => (
                <Badge key={role} variant="outline" className="bg-brand-purple/5 border-brand-purple/20 text-brand-purple text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map(member => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            Updated {formatDate(updatedAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-3 flex justify-between">
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link to={`/projects/${id}`}>View Project</Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowModal(true)}
            className="h-8"
            disabled={!user}
          >
            Apply to Project
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Users className="h-4 w-4" />
          </Button>
        </div>
        <ProjectApplicationModal
          open={showModal}
          onOpenChange={setShowModal}
          onSubmit={handleApply}
          loading={isSubmitting}
        />
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
