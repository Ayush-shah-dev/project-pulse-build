
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
    console.log("Handling application response");
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("applicationId");
    const action = url.searchParams.get("action");

    console.log(`Processing ${action} for application ${applicationId}`);

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

    // First, get application details to notify the applicant
    const { data: application, error: appError } = await supabase
      .from("project_applications")
      .select(`
        id,
        project_id,
        applicant_id,
        project:project_id (
          title,
          creator_id
        )
      `)
      .eq("id", applicationId)
      .maybeSingle();
    
    if (appError || !application) {
      console.error("Failed to fetch application details:", appError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch application details" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Update the application status
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
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Response</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
          }
          .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            max-width: 500px;
            width: 100%;
          }
          h1 {
            margin-top: 0;
            color: ${newStatus === "accepted" ? "#16a34a" : "#dc2626"};
            font-size: 1.5rem;
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 1.5rem;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${newStatus === "accepted" ? "✅" : "❌"}</div>
          <h1>${successMessage}</h1>
          <p>You have ${newStatus === "accepted" ? "accepted" : "rejected"} the application for project "${application.project.title}".</p>
          <p>The applicant will be notified of your decision.</p>
          <p>Thank you for your response.</p>
          <a href="${SUPABASE_URL.replace('.supabase.co', '.lovable.app')}/dashboard" class="button">Go to Dashboard</a>
        </div>
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
