import React, { ChangeEvent, DragEvent } from "react";
import { X, Upload } from "lucide-react";

interface ImageFile extends File {
  preview: string;
}

interface ImageUploadProps {
  images: ImageFile[];
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages }) => {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    })) as ImageFile[];
    setImages([...images, ...files]);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
    })) as ImageFile[];
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <div key={index} className="relative flex-shrink-0 my-2 h-40">
            <img
              src={image.preview}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-dashed border-2 border-gray-300 px-4 py-8 rounded-md flex flex-col items-center"
      >
        <div className="text-muted-foreground mb-3">
          Drag and drop images here or
        </div>
        <label
          htmlFor="image-upload"
          className="inline-flex items-center gap-2 font-medium text-primary cursor-pointer"
        >
          <span>Upload Images</span>
          <Upload className="w-5 h-5" />
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </>
  );
};

export default ImageUpload;
