
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  applicantName: string;
  applicantEmail: string;
  projectId: string;
  projectTitle: string;
  applicationId: string;
  ownerEmail: string;
  ownerName: string;
  baseUrl: string; // frontend base url to build links
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
    const data: SendEmailRequest = await req.json();

    const acceptLink = `${data.baseUrl}/applications/respond?applicationId=${data.applicationId}&action=accept`;
    const rejectLink = `${data.baseUrl}/applications/respond?applicationId=${data.applicationId}&action=reject`;

    const html = `
      <div>
        <h1>New Application for Your Project "${data.projectTitle}"</h1>
        <p>Hi ${data.ownerName || "there"},</p>
        <p>${data.applicantName} has applied to join your project.</p>
        <p>You can respond to this application by clicking one of the buttons below:</p>
        <p>
          <a href="${acceptLink}" style="text-decoration:none; padding:10px 20px; background-color:#22c55e; color:white; border-radius:6px; margin-right:10px;">Accept</a>
          <a href="${rejectLink}" style="text-decoration:none; padding:10px 20px; background-color:#ef4444; color:white; border-radius:6px;">Reject</a>
        </p>
        <p>If these links do not work, you can log in to the site and respond from your dashboard.</p>
        <p>Thank you,<br/>The Collaboration Platform Team</p>
      </div>
    `;

    await resend.emails.send({
      from: "Collab Platform <no-reply@collabplatform.com>",
      to: [data.ownerEmail],
      subject: `New application for your project "${data.projectTitle}"`,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error sending application email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

serve(handler);
