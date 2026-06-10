import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface VellureButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: ReactNode;
}

export function VellureButton({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon, 
  className, 
  ...props 
}: VellureButtonProps) {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variant === 'primary' && "bg-burgundy text-white hover:bg-opacity-95 shadow-lg shadow-burgundy/10 hover:shadow-xl hover:shadow-burgundy/20",
        variant === 'secondary' && "bg-gold text-white hover:bg-opacity-95 shadow-md shadow-gold/10",
        variant === 'outline' && "border-2 border-burgundy/20 text-burgundy hover:bg-burgundy/5 bg-transparent",
        variant === 'ghost' && "text-gray-500 hover:bg-gray-50 bg-transparent",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

interface VellureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function VellureInput({ label, error, className, ...props }: VellureInputProps) {
  return (
    <div className="space-y-2 w-full">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
        {label}
      </label>
      <input
        className={cn(
          "w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-burgundy/10 focus:border-burgundy font-medium transition-all placeholder:text-gray-300",
          error && "border-red-200 focus:ring-red-100 focus:border-red-500 bg-red-50/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-500 mt-1 pl-1 italic">
          {error}
        </p>
      )}
    </div>
  );
}
