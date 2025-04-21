
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DirectMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (message: string) => void;
  loading?: boolean;
  projectTitle?: string;
}

export default function DirectMessageModal({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  projectTitle,
}: DirectMessageModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      // Don't clear the message here - wait until success confirmation
    }
  };

  // Clear message when modal is closed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMessage("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Project Owner</DialogTitle>
          <DialogDescription>
            {projectTitle 
              ? `Send a message about "${projectTitle}"` 
              : "Introduce yourself and explain why you'd like to join this project"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Hi there! I'm interested in your project and would like to learn more about how I can contribute..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-32"
              disabled={loading}
              autoFocus
            />
            {message.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Please enter a message to continue
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
