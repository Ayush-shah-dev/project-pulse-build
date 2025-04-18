
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { LifeBuoy } from "lucide-react";

const Support = () => {
  return (
    <Layout>
      <Helmet>
        <title>Support | CO-brew - Help and Customer Support</title>
        <meta 
          name="description" 
          content="Get help and support for CO-brew. Find answers to common questions, contact our support team, and resolve issues quickly." 
        />
        <meta name="keywords" content="technical support, developer help, troubleshooting, FAQ, customer service, software support" />
        <meta property="og:title" content="CO-brew Support Center" />
        <meta property="og:description" content="Get expert help and answers to your questions about the CO-brew collaborative development platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="CO-brew Support Center" />
        <meta name="twitter:description" content="Get expert help and answers to your questions about the CO-brew collaborative development platform." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <LifeBuoy className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Support</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>How Can We Help?</h2>
            <p>
              Our support team is here to help you make the most of CO-brew. Find answers to common questions
              or get in touch with our team.
            </p>
            
            <h3>Common Topics</h3>
            <ul>
              <li>Account Management</li>
              <li>Project Setup</li>
              <li>Collaboration Features</li>
              <li>Technical Issues</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
