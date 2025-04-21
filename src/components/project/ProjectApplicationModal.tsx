
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answers: { why: string; experience: string; }) => Promise<void>;
  loading: boolean;
}

const DEFAULT_QUESTIONS = [
  {
    id: "why",
    label: "Why do you want to join this project?",
    type: "textarea",
  },
  {
    id: "experience",
    label: "What relevant skills or experience do you bring?",
    type: "textarea",
  }
  // You can easily add more questions here if desired.
];

const ProjectApplicationModal = ({ open, onOpenChange, onSubmit, loading }: ProjectApplicationModalProps) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showError, setShowError] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setShowError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation: require all answers
    if (DEFAULT_QUESTIONS.some(q => !answers[q.id] || !answers[q.id].trim())) {
      setShowError(true);
      return;
    }
    await onSubmit({ why: answers.why, experience: answers.experience });
    setAnswers({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {DEFAULT_QUESTIONS.map(q => (
            <div key={q.id}>
              <label className="font-medium mb-1 block">{q.label}</label>
              {q.type === "textarea" ? (
                <Textarea
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  className="resize-none"
                />
              ) : (
                <Input
                  value={answers[q.id] || ""}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                />
              )}
            </div>
          ))}
          {showError && (
            <div className="text-destructive text-sm font-medium">
              Please answer all questions.
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectApplicationModal;
