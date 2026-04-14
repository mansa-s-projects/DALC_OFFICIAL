"use client";

import { ChangeEvent, useState } from "react";

export default function VisaPhotoUpload() {
  const [image, setImage] = useState<string | null>(null);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  };

  return (
    <div className="mt-10 text-center">
      <h2 className="text-xl mb-4">Upload Passport Photo</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {image && (
        <div className="flex flex-col items-center gap-4">
          <img
            src={image}
            alt="Passport preview"
            className="w-40 h-40 object-cover rounded"
          />

          <button className="bg-yellow-500 text-black px-4 py-2 rounded">
            Process Photo
          </button>
        </div>
      )}
    </div>
  );
}