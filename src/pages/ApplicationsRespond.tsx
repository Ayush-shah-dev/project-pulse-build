
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function ApplicationsRespond() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const applicationId = searchParams.get("applicationId");
  const action = searchParams.get("action");

  useEffect(() => {
    // Validate parameters
    if (!applicationId || !["accept", "reject"].includes(action as string)) {
      setError("Invalid parameters provided. Please check your link and try again.");
      setIsLoading(false);
      return;
    }
    
    // Check if application exists and has a valid status
    const checkApplication = async () => {
      try {
        const { data, error } = await supabase
          .from("project_applications")
          .select("id, status, project_id, project:project_id (title)")
          .eq("id", applicationId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (!data) {
          setError("Application not found. It may have been deleted.");
        } else if (data.status !== "pending") {
          setError(`This application has already been ${data.status}.`);
        }
      } catch (err) {
        console.error("Error checking application:", err);
        setError("An error occurred while checking the application.");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApplication();
  }, [applicationId, action]);

  const handleAction = async () => {
    if (!applicationId || !action) return;
    
    setIsProcessing(true);
    try {
      // Update application status
      const status = action === "accept" ? "accepted" : "rejected";
      const { error } = await supabase
        .from("project_applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId);
        
      if (error) throw error;
      
      // Notify the applicant
      await supabase.functions.invoke("notify-applicant", {
        body: {
          applicationId,
          status
        },
      });
      
      setSuccess(`You have successfully ${status} the application.`);
      
      toast({
        title: `Application ${status}`,
        description: `You have ${status} the application. The applicant has been notified.`,
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      setError(`Failed to ${action} the application. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Application Response</CardTitle>
              <CardDescription>
                {action === "accept" 
                  ? "Accept this application to your project" 
                  : "Reject this application to your project"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
                  <p className="text-destructive">{error}</p>
                </div>
              ) : success ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <p className="text-green-600">{success}</p>
                  <p className="text-muted-foreground mt-2">Redirecting to dashboard...</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">
                    Are you sure you want to {action} this application?
                  </p>
                  {action === "accept" ? (
                    <p className="text-green-600 mb-2">
                      The applicant will be notified that they have been accepted to the project.
                    </p>
                  ) : (
                    <p className="text-destructive mb-2">
                      The applicant will be notified that their application has been rejected.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            
            {!isLoading && !error && !success && (
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={isProcessing}
                  className={action === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-destructive"}
                >
                  {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {action === "accept" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept Application
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject Application
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
