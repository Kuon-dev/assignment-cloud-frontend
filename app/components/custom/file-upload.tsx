// components/ui/FileInput.tsx
import React, { useRef } from "react";
import { useController, Control } from "react-hook-form";

interface FileInputProps {
  name: string;
  control: Control<any>;
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ name, control, label }) => {
  const { field } = useController({
    name,
    control,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <label className="font-semibold">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          field.onChange(file);
        }}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Choose File
      </button>
      <span className="ml-2 text-gray-600">
        {field.value?.name || "No file chosen"}
      </span>
    </div>
  );
};

export default FileInput;
