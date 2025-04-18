
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Newspaper } from "lucide-react";

const Blog = () => {
  return (
    <Layout>
      <Helmet>
        <title>Blog | CO-brew - Latest Updates and Insights</title>
        <meta 
          name="description" 
          content="Stay up to date with the latest news, updates, and insights from CO-brew. Learn about new features, success stories, and best practices." 
        />
        <meta name="keywords" content="development blog, collaborative coding, software development, programming news, team collaboration, project management" />
        <meta property="og:title" content="CO-brew Development Blog" />
        <meta property="og:description" content="Stay informed with the latest updates, tips, and success stories from the CO-brew development platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="CO-brew Development Blog" />
        <meta name="twitter:description" content="Stay informed with the latest updates, tips, and success stories from the CO-brew development platform." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-8 w-8 text-brand-purple" />
            <h1 className="text-4xl font-bold">Blog</h1>
          </div>
          <div className="prose prose-lg max-w-none">
            <h2>Latest from CO-brew</h2>
            <p>
              Discover the latest updates, insights, and success stories from the CO-brew community.
            </p>
            
            <h3>Featured Articles</h3>
            <ul>
              <li>How Teams Are Using CO-brew to Build Better Software</li>
              <li>Best Practices for Remote Collaboration</li>
              <li>New Features and Updates</li>
              <li>Community Spotlights</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
