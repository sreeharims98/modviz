import { SUPABASE_STORAGE_BUCKET_MODELS } from "@/constants";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useShare = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelUrls, setModelUrls] = useState<string[]>([]);
  const [loadingModelUrls, setLoadingModelUrls] = useState(true);

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
      setIsUploading(true);

      const userId = await getUserId();

      const filePath = `${userId}/${Date.now()}-${modelFile.name}`;

      const { error, data } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET_MODELS)
        .upload(filePath, modelFile);

      console.log("Upload error:", error);
      console.log("Upload data:", data);

      if (data) {
        setShareUrl(`${window.location.href}?id=${data.id}`);
        setIsModalOpen(true);
        fetchUserAndFiles();
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
      setIsModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  // Get user id and list their files
  const fetchUserAndFiles = useCallback(async () => {
    const userId = await getUserId();

    if (userId) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET_MODELS)
        .list(userId);

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      // Generate signed URLs
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from(SUPABASE_STORAGE_BUCKET_MODELS)
            .getPublicUrl(`${userId}/${file.name}`);
          return urlData?.publicUrl ?? "";
        })
      );
      setModelUrls(urls);
      setLoadingModelUrls(false);
    }
  }, [getUserId, supabase.storage]);

  useEffect(() => {
    fetchUserAndFiles();
  }, [fetchUserAndFiles]);

  return {
    isUploading,
    shareUrl,
    isModalOpen,
    setIsModalOpen,
    generateShareLink,
    modelUrls,
    loadingModelUrls,
  };
};
