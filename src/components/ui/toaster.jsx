// src/components/ui/toast.jsx
import * as React from "react";

export function Toast({ children, ...props }) {
  return (
    <div className="border p-4 rounded bg-white shadow" {...props}>
      {children}
    </div>
  );
}

export function ToastTitle({ children }) {
  return <div className="font-bold">{children}</div>;
}

export function ToastDescription({ children }) {
  return <div className="text-sm text-gray-600">{children}</div>;
}

export function ToastClose() {
  return <button className="ml-2 text-red-500">X</button>;
}

export function ToastProvider({ children }) {
  return <div>{children}</div>;
}

export function ToastViewport({ children }) {
  return <div className="fixed bottom-4 right-4 space-y-2">{children}</div>;
}
