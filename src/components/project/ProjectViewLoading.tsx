
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";

export default function ProjectViewLoading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading project details...</span>
      </div>
    </Layout>
  );
}
