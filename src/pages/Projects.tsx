
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/project/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for projects
const mockProjects = [
  {
    id: "proj1",
    title: "EcoTrack - Environmental Monitoring Platform",
    description: "A platform for tracking and visualizing environmental data from DIY sensors to help communities monitor local pollution levels and advocate for change.",
    tags: ["Climate Tech", "IoT", "Data Visualization", "React", "Python"],
    stage: "prototype" as const,
    members: [
      { id: "user1", name: "Emily Chen", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
      { id: "user3", name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
      { id: "user4", name: "Michael Rodriguez", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }
    ],
    rolesNeeded: ["Mobile Developer", "UX Designer", "Environmental Scientist"],
    matchScore: 92,
    updatedAt: "2025-03-29"
  },
  {
    id: "proj2",
    title: "Linguify - AI Language Learning Assistant",
    description: "An AI-powered language learning platform that creates personalized learning paths and realistic conversation practice through natural language processing.",
    tags: ["AI", "Education", "NLP", "Mobile", "React Native"],
    stage: "mvp" as const,
    members: [
      { id: "user2", name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: "user5", name: "Jessica Lee", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }
    ],
    rolesNeeded: ["Machine Learning Engineer", "Content Creator", "Marketing"],
    matchScore: 85,
    updatedAt: "2025-04-02"
  },
  {
    id: "proj3",
    title: "Freelance Hub - Project Management for Independent Workers",
    description: "A comprehensive tool for freelancers to manage clients, track time, send invoices, and handle taxes - all in one platform.",
    tags: ["SaaS", "Productivity", "Fintech", "Vue.js", "Node.js"],
    stage: "idea" as const,
    members: [
      { id: "user6", name: "Thomas Wright", avatar: "https://randomuser.me/api/portraits/men/67.jpg" }
    ],
    rolesNeeded: ["Full Stack Developer", "UX Designer", "Financial Expert", "Product Manager"],
    matchScore: 79,
    updatedAt: "2025-04-08"
  },
  {
    id: "proj4",
    title: "MentalHealth.ai - Accessible Therapy Tools",
    description: "An open-source platform providing evidence-based mental health tools and resources, with AI guidance for personalized self-help strategies.",
    tags: ["Healthcare", "AI", "Open Source", "Social Impact", "React"],
    stage: "prototype" as const,
    members: [
      { id: "user1", name: "Emily Chen", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
      { id: "user4", name: "Michael Rodriguez", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
      { id: "user5", name: "Jessica Lee", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
      { id: "user3", name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/22.jpg" }
    ],
    rolesNeeded: ["ML Engineer", "Mental Health Professional", "Content Writer"],
    matchScore: 88,
    updatedAt: "2025-03-26"
  },
  {
    id: "proj5",
    title: "LocalEats - Support Small Food Businesses",
    description: "A platform connecting consumers with local, independent food businesses for ordering, delivery, and discovery - helping small businesses compete with big delivery apps.",
    tags: ["Marketplace", "Food Tech", "Mobile", "Flutter", "Firebase"],
    stage: "mvp" as const,
    members: [
      { id: "user2", name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: "user6", name: "Thomas Wright", avatar: "https://randomuser.me/api/portraits/men/67.jpg" }
    ],
    rolesNeeded: ["Mobile Developer", "Growth Hacker", "UI Designer"],
    matchScore: 76,
    updatedAt: "2025-04-05"
  },
  {
    id: "proj6",
    title: "CodeMentor - Peer Programming Learning Platform",
    description: "A platform that matches coding mentors with learners for live pair programming sessions, knowledge sharing, and project collaboration.",
    tags: ["Education", "Dev Tools", "Community", "JavaScript", "WebRTC"],
    stage: "launched" as const,
    members: [
      { id: "user1", name: "Emily Chen", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
      { id: "user3", name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
      { id: "user5", name: "Jessica Lee", avatar: "https://randomuser.me/api/portraits/women/45.jpg" }
    ],
    rolesNeeded: ["Marketing Specialist", "Community Manager"],
    matchScore: 82,
    updatedAt: "2025-03-21"
  }
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [filterExpanded, setFilterExpanded] = useState(false);

  const filteredProjects = mockProjects
    .filter(project => 
      selectedStage === "all" || project.stage === selectedStage
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Open Projects</h1>
            <p className="text-muted-foreground">
              Discover projects looking for collaborators or start your own.
            </p>
          </div>
          <Link to="/projects/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, description, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Badge 
            variant={selectedStage === "all" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("all")}
          >
            All Stages
          </Badge>
          <Badge 
            variant={selectedStage === "idea" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("idea")}
          >
            Idea
          </Badge>
          <Badge 
            variant={selectedStage === "prototype" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("prototype")}
          >
            Prototype
          </Badge>
          <Badge 
            variant={selectedStage === "mvp" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("mvp")}
          >
            MVP
          </Badge>
          <Badge 
            variant={selectedStage === "launched" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedStage("launched")}
          >
            Launched
          </Badge>
        </div>

        {filterExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="health">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="social">Social Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skills Needed</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="pm">Project Management</SelectItem>
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
                  <SelectItem value="recent">Recently Updated</SelectItem>
                  <SelectItem value="members">Team Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              stage={project.stage}
              members={project.members}
              rolesNeeded={project.rolesNeeded}
              matchScore={project.matchScore}
              updatedAt={project.updatedAt}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
