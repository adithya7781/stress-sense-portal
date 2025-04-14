
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  message: string | null;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;
  
  return (
    <div className="bg-destructive/15 p-3 rounded-md border border-destructive flex items-start space-x-2">
      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
      <span className="text-sm text-destructive">{message}</span>
    </div>
  );
};

export default ErrorAlert;
