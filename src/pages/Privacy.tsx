
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | CO-brew</title>
        <meta 
          name="description" 
          content="Privacy Policy for CO-brew. Learn how we collect, use, and protect your personal information." 
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>Last Updated: April 18, 2025</p>
            
            <h2>1. Introduction</h2>
            <p>
              At CO-brew, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our collaborative development platform.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as:
            </p>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Profile information (bio, skills, location)</li>
              <li>Project and content data</li>
              <li>Communications with us and other users</li>
            </ul>
            
            <p>
              We also automatically collect certain information when you use our platform:
            </p>
            <ul>
              <li>Log and usage data</li>
              <li>Device information</li>
              <li>Location information</li>
              <li>Cookies and tracking technologies</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you technical notices and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect the security and integrity of our platform</li>
            </ul>
            
            <h2>4. Sharing Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Other users (based on your privacy settings)</li>
              <li>Service providers and partners</li>
              <li>In response to legal requirements</li>
              <li>With your consent</li>
            </ul>
            
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2>6. Your Rights and Choices</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Set browser cookies preferences</li>
            </ul>
            
            <h2>7. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence, which may have different data protection laws.
            </p>
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.
            </p>
            
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@co-brew.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
