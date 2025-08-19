import { EmptyMessage } from "../EmptyMessage";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Check, Copy, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useShare } from "@/hooks/useShare";

export const SharePanel = () => {
  const isModelLoaded = useAppStore((state) => state.isModelLoaded);
  const [copied, setCopied] = useState(false);
  const {
    isLoading,
    shareUrl,
    isModalOpen,
    setIsModalOpen,
    generateShareLink,
    modelUrls,
  } = useShare();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {!isModelLoaded ? (
        <EmptyMessage icon="🎬" title="Load a 3D model to edit scene" />
      ) : (
        <>
          <Button
            className="w-full flex items-center gap-2"
            onClick={generateShareLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {isLoading ? "Generating Link..." : "Share Model"}
          </Button>

          {modelUrls.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Your Models</h2>
              <ul className="space-y-2">
                {modelUrls.map((url, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{url}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share your model</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Anyone with this link will be able to view this model:
                </p>
                <div className="flex items-center gap-2">
                  <Input readOnly value={shareUrl} className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
