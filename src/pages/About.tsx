
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 gradient-text">About CollabHub</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              CollabHub is a platform that connects passionate creators, developers, and entrepreneurs to build amazing projects together.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Mission</h2>
            <p>
              We believe that the best ideas come to life through collaboration. Our mission is to break down the barriers that prevent talented individuals from finding each other and working together on projects they're passionate about.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">The Problem We're Solving</h2>
            <p>
              Many great ideas never see the light of day because:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Talented individuals struggle to find complementary team members</li>
              <li>Remote collaboration is fragmented across too many tools</li>
              <li>Finding the right people who share your vision and work style is challenging</li>
              <li>Building an effective team requires more than just matching skills</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Solution</h2>
            <p>
              CollabHub provides a comprehensive platform that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Uses AI to match individuals based on skills, interests, and work style</li>
              <li>Creates dedicated collaboration spaces with integrated tools</li>
              <li>Provides templates and frameworks to help projects get started quickly</li>
              <li>Builds a community of makers and creators supporting each other</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Team</h2>
            <p>
              CollabHub was founded by a distributed team of entrepreneurs, developers, and designers who experienced firsthand the challenges of finding the right collaborators and building effective teams.
            </p>
            <p>
              We're passionate about enabling more people to bring their ideas to life through the power of collaboration.
            </p>
            
            <div className="border-t border-b py-8 my-10">
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="mb-6">
                Whether you have a project idea, want to contribute your skills, or just want to connect with like-minded creators, CollabHub is the place for you.
              </p>
              <Link to="/signup">
                <Button className="mt-2">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
