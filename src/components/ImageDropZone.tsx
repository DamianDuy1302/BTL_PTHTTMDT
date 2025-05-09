"use client";

import axiosInstance from "@/config/axios";
import { useToast } from "@/hooks/use-toast";
import { CircleX, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone({ files, setFiles }: any) {
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải lên
  // Xử lý khi người dùng kéo thả file vào
  const { toast } = useToast();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsLoading(true); // Bắt đầu tải lên
      for (const file of acceptedFiles) {
        if (file.size > 102400) {
          toast({
            variant: "destructive",
            title: "Tải ảnh lên thất bại",
            description: "Kích thước ảnh không được lớn hơn 100KB",
          });
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosInstance("/upload", {
          method: "POST",
          data: formData,
        });

        setFiles((prevFiles) => [...prevFiles, res.data.data]); // Lưu danh sách ảnh
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Kết thúc tải lên
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Chỉ chấp nhận ảnh
    multiple: true, // Cho phép upload nhiều ảnh
  });

  return (
    <div className="flex flex-col p-5 border-2 border-dashed border-gray-300 rounded-lg">
      {/* Khu vực kéo thả */}
      <div
        {...getRootProps()}
        className="w-full p-10 text-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition rounded-lg"
      >
        <input {...getInputProps()} />
        <div>
          Kéo & thả ảnh vào đây hoặc nhấn để chọn ảnh{" "}
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto my-4" />
          ) : null}
        </div>
      </div>

      {/* Hiển thị danh sách ảnh đã tải lên */}
      <div className="flex items-center">
        {" "}
        <div className="mt-4 grid grid-cols-3 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative ">
              <img
                src={file}
                alt={`img-${index}`}
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
    </div>
  );
}
