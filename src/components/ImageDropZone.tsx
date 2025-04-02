"use client";

import { CircleX } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ files, setFiles }: any) {
  // Xử lý khi người dùng kéo thả file vào
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Lưu danh sách ảnh
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Chỉ chấp nhận ảnh
    multiple: true, // Cho phép upload nhiều ảnh
  });

  return (
    <div className="flex flex-col items-center p-5 border-2 border-dashed border-gray-300 rounded-lg">
      {/* Khu vực kéo thả */}
      <div
        {...getRootProps()}
        className="w-full p-10 text-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition rounded-lg"
      >
        <input {...getInputProps()} />
        <p>Kéo & thả ảnh vào đây hoặc nhấn để chọn ảnh</p>
      </div>

      {/* Hiển thị danh sách ảnh đã tải lên */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative ">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div
              onClick={() => {
                setFiles((prev) => prev.filter((_, i) => i !== index));
              }}
              className="absolute top-0 right-0 p-1 bg-white rounded-full cursor-pointer hover:bg-gray-200"
            >
              <CircleX size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
