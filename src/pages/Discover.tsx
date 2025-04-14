
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import UserCard from "@/components/user/UserCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "user1",
    name: "Emily Chen",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    matchScore: 89,
    location: "San Francisco, CA"
  },
  {
    id: "user2",
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "UX/UI Designer",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "CSS"],
    matchScore: 85,
    location: "New York, NY"
  },
  {
    id: "user3",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    title: "Product Manager",
    skills: ["Agile", "User Stories", "Roadmapping", "Analytics", "Leadership"],
    matchScore: 78,
    location: "Boston, MA"
  },
  {
    id: "user4",
    name: "Michael Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "TensorFlow"],
    matchScore: 76,
    location: "Austin, TX"
  },
  {
    id: "user5",
    name: "Jessica Lee",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    title: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
    matchScore: 72,
    location: "Seattle, WA"
  },
  {
    id: "user6",
    name: "Thomas Wright",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    title: "Blockchain Developer",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "DeFi"],
    matchScore: 70,
    location: "Miami, FL"
  }
];

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpanded, setFilterExpanded] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Collaborators</h1>
          <p className="text-muted-foreground">
            Find like-minded people with complementary skills for your next project.
          </p>
        </div>

        <Tabs defaultValue="people" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilterExpanded(!filterExpanded)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <TabsContent value="people">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, skills, or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filterExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-md">
                <div>
                  <label className="text-sm font-medium mb-1 block">Skill Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Anywhere" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="remote">Remote Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Match Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match Score</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                      <SelectItem value="experience">Experience Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUsers.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  avatar={user.avatar}
                  title={user.title}
                  skills={user.skills}
                  matchScore={user.matchScore}
                  location={user.location}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="flex justify-center items-center p-10">
              <p className="text-muted-foreground">
                Switch to the Projects tab to discover open projects.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Discover;
