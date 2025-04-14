
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "CollabHub helped me find the perfect teammates for my startup. The matchmaking algorithm really works!",
    author: {
      name: "Sarah Johnson",
      role: "Founder, EcoTech Solutions",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    rating: 5
  },
  {
    id: 2,
    content: "I've contributed to three projects through CollabHub, and each experience has been amazing. The platform makes remote collaboration so easy.",
    author: {
      name: "Michael Chen",
      role: "Full-Stack Developer",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    rating: 5
  },
  {
    id: 3,
    content: "As a designer, I was looking for technical co-founders. CollabHub connected me with developers who shared my vision.",
    author: {
      name: "Alex Rivera",
      role: "UX/UI Designer",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover how CollabHub is helping people build amazing projects together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                    <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.author.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
