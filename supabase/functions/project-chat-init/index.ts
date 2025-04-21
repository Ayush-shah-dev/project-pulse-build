
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
    const { applicationId, projectOwnerId, applicantId } = await req.json();
    
    if (!applicationId || !projectOwnerId || !applicantId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get application details to confirm it's accepted
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
    
    if (application.status !== "accepted") {
      return new Response(
        JSON.stringify({ error: "Application is not accepted" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Create initial welcome message in the chat
    const { data: message, error: messageError } = await supabase
      .from("project_chat_messages")
      .insert({
        project_id: application.project_id,
        sender_id: projectOwnerId,
        content: "Welcome to the project! I've accepted your application. Let's discuss how you can contribute."
      })
      .select()
      .single();
      
    if (messageError) {
      console.error("Error creating welcome message:", messageError);
      return new Response(
        JSON.stringify({ error: "Failed to initialize chat" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
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
