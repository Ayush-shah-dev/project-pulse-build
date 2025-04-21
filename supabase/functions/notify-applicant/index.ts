
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabaseClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const supabase = supabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyApplicantRequest {
  applicationId: string;
  status: string; // accepted or rejected
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Processing applicant notification request");
    const { applicationId, status }: NotifyApplicantRequest = await req.json();
    
    if (!applicationId || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, 
        headers: corsHeaders
      });
    }

    // Get application details including project and applicant information
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
      console.error("Failed to fetch application:", appError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch application details" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Get applicant email
    const { data: applicantData, error: applicantError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", application.applicant_id)
      .maybeSingle();
    
    if (applicantError || !applicantData?.email) {
      console.error("Failed to fetch applicant email:", applicantError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch applicant email" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Get project owner details for the email
    const { data: ownerProfile } = await supabase
      .from("profile_details")
      .select("first_name, last_name")
      .eq("id", application.project.creator_id)
      .maybeSingle();
    
    const ownerName = ownerProfile
      ? `${ownerProfile.first_name || ""} ${ownerProfile.last_name || ""}`.trim()
      : "The project owner";
    
    // Prepare and send email notification
    const isAccepted = status === "accepted";
    const projectUrl = `${SUPABASE_URL.replace('.supabase.co', '.lovable.app')}/projects/${application.project_id}`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${isAccepted ? '#16a34a' : '#dc2626'}; font-size: 24px;">
          Your application has been ${isAccepted ? 'accepted' : 'rejected'}
        </h1>
        <p>Hi there,</p>
        <p>${ownerName} has ${isAccepted ? 'accepted' : 'rejected'} your application to join the project "${application.project.title}".</p>
        ${isAccepted 
          ? `<p>You can now start collaborating on the project. Visit the project page to get started:</p>
             <p><a href="${projectUrl}" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">View Project</a></p>`
          : `<p>Don't worry! There are plenty of other projects that might be a better fit for your skills.</p>
             <p><a href="${SUPABASE_URL.replace('.supabase.co', '.lovable.app')}/projects" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Browse Projects</a></p>`
        }
        <p>Thank you for your interest in collaborating!</p>
        <p>Best regards,<br>The Collaboration Platform Team</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Collab Platform <no-reply@collabplatform.com>",
      to: [applicantData.email],
      subject: `Your application for "${application.project.title}" has been ${isAccepted ? 'accepted' : 'rejected'}`,
      html,
    });

    console.log("Notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending applicant notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

serve(handler);
