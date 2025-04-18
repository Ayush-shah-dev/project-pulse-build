
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const SocialAuth = () => {
  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "GitHub login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleGithubLogin}
      >
        <Github className="h-4 w-4" />
        GitHub
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleGoogleLogin}
      >
        <Mail className="h-4 w-4" />
        Google
      </Button>
    </div>
  );
};

export default SocialAuth;
