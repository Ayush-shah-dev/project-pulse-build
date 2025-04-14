
import { BrainCircuit, FileText, Lightbulb, UserCheck, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-brand-purple" />,
    title: "AI-Powered Matchmaking",
    description: "Our intelligent algorithm connects you with the perfect collaborators based on skills, interests, and work style."
  },
  {
    icon: <Users className="h-10 w-10 text-brand-purple" />,
    title: "Team Formation",
    description: "Easily form teams for your projects and find people who complement your skills and share your vision."
  },
  {
    icon: <Zap className="h-10 w-10 text-brand-purple" />,
    title: "Real-Time Collaboration",
    description: "Work together in shared spaces with integrated chat, whiteboard, task management, and video calls."
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-brand-purple" />,
    title: "Idea to Launch",
    description: "Take your project from concept to completion with structured workflows and startup tools."
  },
  {
    icon: <FileText className="h-10 w-10 text-brand-purple" />,
    title: "Project Showcase",
    description: "Showcase your completed projects to the community and build your portfolio of achievements."
  },
  {
    icon: <UserCheck className="h-10 w-10 text-brand-purple" />,
    title: "Skill Recognition",
    description: "Get recognized for your contributions and build a reputation in your areas of expertise."
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Everything You Need to Build Together</h2>
          <p className="mt-4 text-lg text-gray-600">
            CollabHub provides all the tools you need to find collaborators, form teams, and bring your ideas to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
