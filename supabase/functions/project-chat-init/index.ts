
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabaseClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

// Create a Supabase client
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = supabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Project chat init function called");
    const { applicationId, applicantId } = await req.json();
    
    if (!applicationId || !applicantId) {
      console.error("Missing required parameters:", { applicationId, applicantId });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Processing chat init for application:", applicationId);
    
    // Get application details to get project info and confirm it's valid
    const { data: application, error: appError } = await supabase
      .from("project_applications")
      .select("status, project_id")
      .eq("id", applicationId)
      .maybeSingle();
      
    if (appError || !application) {
      console.error("Error fetching application:", appError);
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Application status:", application.status);
    
    // Get the project creator ID to use as the sender of the welcome message
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("creator_id")
      .eq("id", application.project_id)
      .maybeSingle();
      
    if (projectError || !project) {
      console.error("Error fetching project:", projectError);
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Create initial welcome message in the chat
    console.log("Creating welcome message for project:", application.project_id);
    console.log("From project owner:", project.creator_id);
    
    const { data: message, error: messageError } = await supabase
      .from("project_chat_messages")
      .insert({
        project_id: application.project_id,
        sender_id: project.creator_id,
        content: "Welcome to the project! I've accepted your application. Let's discuss how you can contribute."
      })
      .select()
      .single();
      
    if (messageError) {
      console.error("Error creating welcome message:", messageError);
      return new Response(
        JSON.stringify({ error: "Failed to initialize chat", details: messageError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Chat initialized successfully with message:", message);
    
    // Update application status to "accepted" if it's not already
    if (application.status !== "accepted") {
      const { error: updateError } = await supabase
        .from("project_applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);
        
      if (updateError) {
        console.error("Error updating application status:", updateError);
        // Continue anyway since we already created the chat message
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, chatInitialized: true, message }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error in project-chat-init function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);
