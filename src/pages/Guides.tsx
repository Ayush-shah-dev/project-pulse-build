
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BookOpen } from "lucide-react";

const Guides = () => {
  return (
    <Layout>
      <Helmet>
        <title>Guides | Co-brew - Step-by-step Tutorials and Best Practices</title>
        <meta 
          name="description" 
          content="Detailed guides and tutorials for Co-brew users. Learn best practices, tips, and tricks for effective collaboration and project management." 
        />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Guides</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>Co-brew Platform Guides</h2>
            <p>
              Our comprehensive guides will help you master Co-brew's features and maximize your team's productivity.
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
