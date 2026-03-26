"use client";

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', onClick, ...props }: ButtonProps) {
  return (
    <button
      className={`bg-accent text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
