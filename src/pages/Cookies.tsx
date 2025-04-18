
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Cookie } from "lucide-react";

const Cookies = () => {
  return (
    <Layout>
      <Helmet>
        <title>Cookie Policy | CO-brew</title>
        <meta 
          name="description" 
          content="Cookie Policy for CO-brew. Learn about how we use cookies and similar technologies on our platform." 
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Cookie className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <p>Last Updated: April 18, 2025</p>
            
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            
            <h2>2. How We Use Cookies</h2>
            <p>
              CO-brew uses cookies and similar technologies for the following purposes:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> Necessary for the basic functionality of our platform</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our platform</li>
              <li><strong>Authentication cookies:</strong> Recognize you when you log in to your account</li>
              <li><strong>Security cookies:</strong> Support our security features and detect malicious activity</li>
            </ul>
            
            <h2>3. Types of Cookies We Use</h2>
            <h3>First-Party Cookies</h3>
            <p>
              These are cookies that are set by CO-brew directly when you visit our platform.
            </p>
            
            <h3>Third-Party Cookies</h3>
            <p>
              These are cookies set by our partners and service providers. They may include:
            </p>
            <ul>
              <li>Analytics providers (like Google Analytics)</li>
              <li>Authentication services</li>
              <li>Customer support tools</li>
            </ul>
            
            <h2>4. Cookie Duration</h2>
            <p>
              We use both session cookies and persistent cookies:
            </p>
            <ul>
              <li><strong>Session cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
            </ul>
            
            <h2>5. Your Cookie Choices</h2>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul>
              <li>Block or delete cookies</li>
              <li>Configure which types of cookies you accept</li>
              <li>Browse in "private" or "incognito" mode</li>
            </ul>
            
            <p>
              Please note that blocking certain cookies may impact your experience on our platform and limit certain functionalities.
            </p>
            
            <h2>6. Changes to Our Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at privacy@co-brew.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
