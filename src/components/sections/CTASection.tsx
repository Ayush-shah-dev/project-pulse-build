
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl p-12 text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Collaborating?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of creators, developers, and entrepreneurs who are building the future together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 bg-white/10 hover:bg-white/20">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
