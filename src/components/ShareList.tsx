import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface ShareListProps {
  url: string;
}

export const ShareList = ({ url }: ShareListProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCopyItem = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const parts = url.split("/");
      const last = parts[parts.length - 1];
      // Remove leading numeric timestamp and hyphen, e.g., 1757955998478-
      return last.replace(/^\d+-/, "");
    } catch {
      return url;
    }
  };

  const handleDelete = async () => {
    // Placeholder delete - implement storage deletion here later
    setIsDeleteOpen(false);
    toast.info("Delete action not implemented yet");
  };

  return (
    <li
      key={url}
      className="flex items-center justify-between gap-3 border rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" title={url}>
          {getFileNameFromUrl(url)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleCopyItem(url)}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDeleteOpen(true)}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete model?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {getFileNameFromUrl(url)}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
