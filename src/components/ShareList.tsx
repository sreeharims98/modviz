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
import { UserSceneProps } from "@/types";

interface ShareListProps {
  userScene: UserSceneProps;
  deleteShareLink: (id: string, url: string) => void;
}

export const ShareList = ({ userScene, deleteShareLink }: ShareListProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCopyItem = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.href}${id}`);
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

  const handleDelete = async (id: string, url: string) => {
    deleteShareLink(id, url);
    setIsDeleteOpen(false);
  };

  return (
    <li
      key={userScene.id}
      className="flex items-center justify-between gap-3 border rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" title={userScene.model_url}>
          {getFileNameFromUrl(userScene.model_url)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleCopyItem(userScene.id)}
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
            Are you sure you want to delete{" "}
            {getFileNameFromUrl(userScene.model_url)}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(userScene.id, userScene.model_path)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
