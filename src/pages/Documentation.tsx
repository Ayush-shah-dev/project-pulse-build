
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Book } from "lucide-react";

const Documentation = () => {
  return (
    <Layout>
      <Helmet>
        <title>Documentation | Co-brew - Collaborative Development Platform</title>
        <meta 
          name="description" 
          content="Comprehensive documentation for Co-brew. Learn how to collaborate effectively, manage projects, and build amazing applications together." 
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Book className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>Getting Started with Co-brew</h2>
            <p>
              Welcome to Co-brew's documentation. Here you'll find everything you need to know about using our platform
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
              Learn about the fundamental concepts that make Co-brew powerful for team collaboration
              and project management.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
