"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Get user id and list their files
    const fetchUserAndFiles = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData.user?.id ?? null;
      setUserId(id);

      console.log("User ID:", id);

      if (id) {
        const { data: files } = await supabase.storage.from("images").list(id);
        if (files) {
          const urls = files.map((file) => {
            const { data } = supabase.storage
              .from("images")
              .getPublicUrl(`${id}/${file.name}`);
            return data.publicUrl;
          });
          setImageUrls(urls);
        }
      }
    };

    fetchUserAndFiles();
  }, [supabase.auth, supabase.storage]);

  const handleUpload = async () => {
    if (!file || !userId) return;
    setUploading(true);

    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error.message);
    } else {
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      setImageUrls((prev) => [data.publicUrl, ...prev]); // add to top
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="User Upload"
            className="w-full h-auto rounded-lg shadow"
          />
        ))}
      </div>
    </div>
  );
}
