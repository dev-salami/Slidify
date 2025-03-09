import React from "react";
import { cn } from "@/lib/utils";

interface MedalProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const GoldMedal = ({ className, size = "md", ...props }: MedalProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Medal ribbon */}
      <div className="absolute -top-1/4">
        <div className="w-3/5 mx-auto h-2/3 bg-yellow-600 rounded-t-full" />
        <div className="flex justify-center -mt-1">
          <div className="w-1/4 h-3 bg-yellow-600 transform -rotate-45 rounded-b-md" />
          <div className="w-1/4 h-3 bg-yellow-600 transform rotate-45 rounded-b-md" />
        </div>
      </div>

      {/* Medal circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-md flex items-center justify-center border-2 border-yellow-500">
        {/* Inner circle detail */}
        <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-300 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-yellow-200" />
        </div>
      </div>
    </div>
  );
};

export const SilverMedal = ({
  className,
  size = "md",
  ...props
}: MedalProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Medal ribbon */}
      <div className="absolute -top-1/4">
        <div className="w-3/5 mx-auto h-2/3 bg-slate-500 rounded-t-full" />
        <div className="flex justify-center -mt-1">
          <div className="w-1/4 h-3 bg-slate-500 transform -rotate-45 rounded-b-md" />
          <div className="w-1/4 h-3 bg-slate-500 transform rotate-45 rounded-b-md" />
        </div>
      </div>

      {/* Medal circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-500 shadow-md flex items-center justify-center border-2 border-slate-400">
        {/* Inner circle detail */}
        <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-slate-400 to-slate-300 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
