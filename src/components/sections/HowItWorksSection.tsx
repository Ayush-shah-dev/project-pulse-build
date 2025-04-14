
import { Check, SearchCheck, Users, Laptop } from "lucide-react";

const steps = [
  {
    icon: <SearchCheck className="h-12 w-12 text-white" />,
    title: "Discover",
    description: "Create your profile, complete the compatibility quiz, and browse projects and potential collaborators.",
    color: "bg-brand-purple"
  },
  {
    icon: <Users className="h-12 w-12 text-white" />,
    title: "Connect",
    description: "Join existing projects or create your own and invite people with complementary skills.",
    color: "bg-brand-blue"
  },
  {
    icon: <Laptop className="h-12 w-12 text-white" />,
    title: "Collaborate",
    description: "Work together in real-time using integrated tools for communication and project management.",
    color: "bg-brand-purple-dark"
  },
  {
    icon: <Check className="h-12 w-12 text-white" />,
    title: "Launch",
    description: "Bring your project to completion and showcase it to the world through the platform.",
    color: "bg-green-500"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">How CollabHub Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            A simple process to help you find the right collaborators and build amazing projects together.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Progress line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className={`md:text-right ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                  <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full ${step.color} mb-4 md:mb-0 mx-auto md:mx-0 ${index % 2 !== 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    {step.icon}
                  </div>
                </div>
                
                <div className={index % 2 !== 0 ? 'md:order-1 md:text-right' : 'md:text-left'}>
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
