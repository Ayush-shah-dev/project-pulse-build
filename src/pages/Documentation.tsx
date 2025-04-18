
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Book } from "lucide-react";

const Documentation = () => {
  return (
    <Layout>
      <Helmet>
        <title>Documentation | CO-brew - Collaborative Development Platform</title>
        <meta 
          name="description" 
          content="Comprehensive documentation for CO-brew. Learn how to collaborate effectively, manage projects, and build amazing applications together." 
        />
        <meta name="keywords" content="development documentation, collaboration tools, project management, developer guides, software documentation, CO-brew platform" />
        <meta property="og:title" content="CO-brew Documentation - Developer Resource Center" />
        <meta property="og:description" content="Find comprehensive guides, API references, and best practices for using the CO-brew collaborative development platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="CO-brew Documentation" />
        <meta name="twitter:description" content="Find comprehensive guides, API references, and best practices for using the CO-brew collaborative development platform." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Book className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>Getting Started with CO-brew</h2>
            <p>
              Welcome to CO-brew's documentation. Here you'll find everything you need to know about using our platform
              for collaborative development and project management.
            </p>
            
            <h3>Quick Start Guide</h3>
            <ol>
              <li>Create your account or join an existing team</li>
              <li>Set up your development environment</li>
              <li>Create or join a project</li>
              <li>Start collaborating with other developers</li>
            </ol>

            <h3>Core Concepts</h3>
            <p>
              Learn about the fundamental concepts that make CO-brew powerful for team collaboration
              and project management.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
