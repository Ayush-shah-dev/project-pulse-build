import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, ArrowRight, Calendar, Users, BookOpen, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectNotifications from "@/components/project/ProjectNotifications";
import ProjectsListCard from "@/components/dashboard/ProjectsListCard";
import ApplicationsListCard from "@/components/dashboard/ApplicationsListCard";
import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";
import RecommendedProjectsCard from "@/components/dashboard/RecommendedProjectsCard";

interface Project {
  id: string;
  title: string;
  description: string;
  stage: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Application {
  id: string;
  project_id: string;
  status: string;
  created_at: string;
  project: {
    title: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch user's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("creator_id", user.id)
          .order("updated_at", { ascending: false });

        if (projectsError) throw projectsError;
        
        // Fetch user's applications data
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("project_applications")
          .select(`
            id,
            project_id,
            status,
            created_at
          `)
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false });

        if (applicationsError) throw applicationsError;
        
        // If we have applications, get the project titles separately
        if (applicationsData && applicationsData.length > 0) {
          const completeApplications: Application[] = [];
          
          for (const app of applicationsData) {
            // Get project title for this application
            const { data: projectData, error: projectError } = await supabase
              .from("projects")
              .select("title")
              .eq("id", app.project_id)
              .single();
              
            if (projectError) {
              console.error("Error fetching project title:", projectError);
              continue;
            }
            
            completeApplications.push({
              ...app,
              project: { title: projectData.title }
            });
          }
          
          setApplications(completeApplications);
        } else {
          setApplications([]);
        }
        
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const getStageColor = (stage: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your dashboard...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              {user && <ProjectNotifications userId={user.id} />}
              <ProjectsListCard projects={projects} getStageColor={getStageColor} formatDate={formatDate} />
              <ApplicationsListCard applications={applications} getStatusColor={getStatusColor} formatDate={formatDate} />
            </div>
            
            <div className="md:col-span-4 space-y-6">
              <ProfileCompletionCard />
              <QuickActionsCard />
              <RecommendedProjectsCard />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
