
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import UserCard from "@/components/user/UserCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDetail {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  title: string | null;
  location: string | null;
  skills: string[] | null;
  industry: string | null;
  education: string | null;
  experience: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  bio: string | null;
}

// Calculate profile completeness score (very basic, adjust as needed)
function getProfileCompletion(profile: ProfileDetail): number {
  const totalFields = 9;
  let filled = 0;
  if (profile.first_name) filled++;
  if (profile.last_name) filled++;
  if (profile.title) filled++;
  if (profile.location) filled++;
  if (profile.skills && profile.skills.length > 0) filled++;
  if (profile.industry) filled++;
  if (profile.education) filled++;
  if (profile.experience) filled++;
  if (profile.bio) filled++;
  return Math.round((filled / totalFields) * 100);
}

const Discover = () => {
  const [users, setUsers] = useState<ProfileDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profile_details")
        .select("*");
      if (!error && data) {
        setUsers(
          data.filter((user: ProfileDetail) => getProfileCompletion(user) >= 70)
        );
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  // Filter by search
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    const skills = user.skills?.join(" ") ?? "";
    const location = user.location ?? "";
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
                      <SelectValue placeholder="Completion %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Profile Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-10">Loading users...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length === 0 ? (
                  <div className="text-muted-foreground text-center col-span-3 py-10">
                    No users found matching your criteria.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex flex-col">
                      <UserCard
                        id={user.id}
                        name={`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Anonymous"}
                        avatar={user.avatar_url ?? undefined}
                        title={user.title ?? ""}
                        skills={user.skills ?? []}
                        location={user.location ?? ""}
                        // Optional: pass in matchScore={getProfileCompletion(user)} for visibility
                      />
                      <Button className="mt-3" variant="secondary">
                        Apply to Project
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
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
