"use client";

import { ReactNode } from "react";

interface StepProps {
  title: string;
  children: ReactNode;
  isActive?: boolean;
  onEdit?: () => void;
}

export default function Step({
  title,
  children,
  isActive = false,
  onEdit,
}: StepProps) {
  return (
    <div
      className={`border rounded-lg p-6 mb-4 transition-all ${
        isActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
