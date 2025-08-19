import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useShare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelUrls, setModelUrls] = useState<string[]>([]);

  const modelFile = useAppStore((state) => state.modelFile);

  const supabase = createClient();

  const getUserId = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id ?? null;
    return userId;
  }, [supabase.auth]);

  const generateShareLink = async () => {
    if (!modelFile) {
      toast.error("No model file loaded to share");
      return;
    }

    try {
      setIsLoading(true);

      const userId = await getUserId();

      const filePath = `${userId}/${Date.now()}-${modelFile.name}`;

      const { error, data } = await supabase.storage
        .from("images")
        .upload(filePath, modelFile);

      console.log("Upload error:", error);
      console.log("Upload data:", data);

      if (data) {
        setShareUrl(`${window.location.href}?id=${data.id}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get user id and list their files
    const fetchUserAndFiles = async () => {
      const userId = await getUserId();

      if (userId) {
        const { data: files } = await supabase.storage
          .from("images")
          .list(userId);
        if (files) {
          const urls = files.map((file) => {
            const { data } = supabase.storage
              .from("images")
              .getPublicUrl(`${userId}/${file.name}`);
            return data.publicUrl;
          });
          setModelUrls(urls);
        }
      }
    };

    fetchUserAndFiles();
  }, [getUserId, supabase.storage]);

  return {
    isLoading,
    shareUrl,
    isModalOpen,
    setIsModalOpen,
    generateShareLink,
    modelUrls,
  };
};
