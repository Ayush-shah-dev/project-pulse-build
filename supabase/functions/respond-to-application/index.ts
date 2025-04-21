
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabaseClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

// We'll create our own supabase client here using env variables.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = supabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("applicationId");
    const action = url.searchParams.get("action");

    if (!applicationId || !action) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";

    const { error } = await supabase
      .from("project_applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (error) {
      console.error("Failed to update application status:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update application status" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Respond with a simple message page
    const successMessage =
      newStatus === "accepted"
        ? "You have accepted the application."
        : "You have rejected the application.";

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><title>Application Response</title></head>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>${successMessage}</h1>
        <p>Thank you for your response. You can close this window.</p>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error processing application response:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

serve(handler);
