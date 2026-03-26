"use client";
import { handleClientScriptLoad } from "next/script";
//app/components/BalanceCard.tsx
import React, { useEffect } from "react";

export default function EditableLabel({ text, placeholder, icon, onChange, className = ''}: { placeholder: string; text?: string; icon?: React.ReactNode; onChange?: (value: string) => void; className?: string }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [textProp, setTextProp] = React.useState(text)
  
  return (
    <span className={`bg-[(--color-card-light)] rounded-md shadow-md border-2 border-gray-100 p-1 flex 
          ${className}`}>
      {icon && <span className="ml-2 flex items-center ">{icon}</span>}
      <input 
        type="text" 
        placeholder={placeholder}
        className={`w-full rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-gray-100 
                    ${isEditing ? "font-normal" : "font-bold"}
                    placeholder:font-light`}
        value={textProp || ''}
        onChange={(e) => {
          setTextProp(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false);
        }}
      />
      
    </span>
  );
}