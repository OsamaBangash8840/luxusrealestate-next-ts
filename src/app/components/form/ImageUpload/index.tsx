'use client';
import React, { useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useUploadImagesMutation } from '../../../lib/features/uploadImages/uploadImgSpliceApi';
import { toast } from 'react-toastify';

interface UploadImageFieldProps {
  label?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
  value?: string[];
  onChange ?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadImageField: React.FC<UploadImageFieldProps> = ({
  label = 'Upload Image',
  className = '',
  accept = 'image/*',
  multiple = false,
}): React.ReactElement => {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  console.log(uploadedUrls)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await uploadImages(formData).unwrap();
      setUploadedUrls(response.map((file: { imageUrl: string }) => file.imageUrl));
      toast.success('Images uploaded successfully!');
    } catch (err: any) {
      console.error('Upload failed:', err);
      toast.error(err?.data?.error || 'Image upload failed');
    }
  };

  return (
    <label
      className={`w-full h-[112px] bg-gradient-to-t from-newLinear/20 to-newLinear/30 flex flex-col items-center justify-center p-4 border border-dashed border-newLinear shadow-sm shadow-newLinear rounded-lg cursor-pointer hover:border-gray-400 ${className}`}
    >
      <IoCloudUploadOutline className="text-2xl text-secondary" />
      <span className="mt-2 text-secondary">{isLoading ? 'Uploading...' : label}</span>
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        disabled={isLoading}
      />
    </label>
  );
};
