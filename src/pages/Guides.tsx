
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BookOpen } from "lucide-react";

const Guides = () => {
  return (
    <Layout>
      <Helmet>
        <title>Guides | CO-brew - Step-by-step Tutorials and Best Practices</title>
        <meta 
          name="description" 
          content="Detailed guides and tutorials for CO-brew users. Learn best practices, tips, and tricks for effective collaboration and project management." 
        />
        <meta name="keywords" content="collaborative development, developer guides, step-by-step tutorials, project management, software development, team collaboration" />
        <meta property="og:title" content="CO-brew Guides & Tutorials" />
        <meta property="og:description" content="Comprehensive guides and tutorials for getting the most out of CO-brew's collaborative development platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="CO-brew Guides & Tutorials" />
        <meta name="twitter:description" content="Comprehensive guides and tutorials for getting the most out of CO-brew's collaborative development platform." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Guides</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>CO-brew Platform Guides</h2>
            <p>
              Our comprehensive guides will help you master CO-brew's features and maximize your team's productivity.
            </p>
            
            <h3>Popular Guides</h3>
            <ul>
              <li>Setting Up Your First Project</li>
              <li>Collaborating with Team Members</li>
              <li>Best Practices for Code Review</li>
              <li>Project Management Workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Guides;
