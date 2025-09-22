import {
  SUPABASE_STORAGE_BUCKET_MODELS,
  SUPABASE_TABLE_USER_SCENE,
} from "@/constants";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useGetUser } from "./useGetUser";
import { UserSceneProps } from "@/types";

export const useShare = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userScenes, setUserScenes] = useState<UserSceneProps[]>([]);
  const [loadingUserScenes, setLoadingUserScenes] = useState(true);

  const modelFile = useAppStore((state) => state.modelFile);

  const supabase = createClient();

  const { user } = useGetUser();

  const generateShareLink = async () => {
    if (!modelFile) {
      toast.error("No model file loaded to share");
      return;
    }

    //check if model size is greater than 25mb
    if (modelFile.size > 25 * 1024 * 1024) {
      toast.error("Model size is greater than 25mb");
      return;
    }

    try {
      setIsUploading(true);

      if (!user) {
        toast.error("No user found");
        return;
      }

      const filePath = `${user.id}/${Date.now()}-${modelFile.name}`;

      // 1. Upload to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET_MODELS)
        .upload(filePath, modelFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload to storage");
        return;
      }

      // 2. Insert into DB
      const { error: insertError, data: insertData } = await supabase
        .from(SUPABASE_TABLE_USER_SCENE)
        .insert([
          {
            user_id: user.id,
            model_url: uploadData.path,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        toast.error("Failed to insert into DB");
        return;
      }

      if (insertData) {
        setShareUrl(`${window.location.href}${insertData.id}`);
        setIsModalOpen(true);
        fetchUserScenes();
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
      setIsModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteShareLink = async (id: string, url: string) => {
    const { error } = await supabase
      .from(SUPABASE_TABLE_USER_SCENE)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete share link");
      return;
    }
    console.log(url, "url");
    const { error: deleteError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET_MODELS)
      .remove([url]);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      toast.error("Failed to delete file from storage");
      return;
    }

    fetchUserScenes();
  };

  // Get user id and list their files
  const fetchUserScenes = useCallback(async () => {
    try {
      if (user) {
        const { data: userSceneData, error } = await supabase
          .from(SUPABASE_TABLE_USER_SCENE)
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Fetch error:", error);
          return;
        }

        // Generate public URLs (getPublicUrl is synchronous)
        const userScenesData: UserSceneProps[] = userSceneData.map(
          (userScene) => {
            const { data: urlData } = supabase.storage
              .from(SUPABASE_STORAGE_BUCKET_MODELS)
              .getPublicUrl(userScene.model_url);
            return {
              ...userScene,
              model_url: urlData?.publicUrl,
              model_path: userScene.model_url,
            };
          }
        );
        setUserScenes(userScenesData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingUserScenes(false);
    }
  }, [supabase, user]);

  const getUserSceneById = useCallback(
    async (id: string) => {
      const { data: userSceneData, error } = await supabase
        .from(SUPABASE_TABLE_USER_SCENE)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      return userSceneData;
    },
    [supabase]
  );

  const getPublicURLbyPath = useCallback(
    async (path: string) => {
      const { data: urlData } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET_MODELS)
        .getPublicUrl(path);
      return urlData?.publicUrl;
    },
    [supabase]
  );

  return {
    isUploading,
    shareUrl,
    isModalOpen,
    setIsModalOpen,
    userScenes,
    loadingUserScenes,
    generateShareLink,
    deleteShareLink,
    fetchUserScenes,
    getUserSceneById,
    getPublicURLbyPath,
  };
};
