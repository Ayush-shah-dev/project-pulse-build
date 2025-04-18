
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | CO-brew</title>
        <meta 
          name="description" 
          content="Terms of Service for CO-brew. Read about the conditions and terms for using our collaborative development platform." 
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>Last Updated: April 18, 2025</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CO-brew's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            
            <h2>2. Description of Service</h2>
            <p>
              CO-brew provides a collaborative development platform that allows users to create projects, collaborate with team members, and manage their development workflow.
            </p>
            
            <h2>3. User Accounts</h2>
            <p>
              To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            
            <h2>4. User Content</h2>
            <p>
              You retain all rights to any content you submit, post or display on or through the Service. By submitting content to CO-brew, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, transmit, and display such content.
            </p>
            
            <h2>5. Conduct and Restrictions</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Upload or transmit malicious code or content</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Collect user information without their consent</li>
            </ul>
            
            <h2>6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice.
            </p>
            
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL CO-BREW BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES.
            </p>
            
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes to these Terms.
            </p>
            
            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@co-brew.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
