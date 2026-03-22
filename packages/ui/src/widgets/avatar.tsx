import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

type ImageStatus = "idle" | "loaded" | "error";

type AvatarContextValue = {
  imageStatus: ImageStatus;
  setImageStatus: React.Dispatch<React.SetStateAction<ImageStatus>>;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext(component: string) {
  const ctx = React.useContext(AvatarContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Avatar>`);
  }
  return ctx;
}

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatarVariants>;

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, children, ...props }, ref) => {
    const [imageStatus, setImageStatus] =
      React.useState<ImageStatus>("idle");

    return (
      <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
        <span
          ref={ref}
          className={cn(avatarVariants({ size }), className)}
          {...props}
        >
          {children}
        </span>
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, onLoad, onError, alt = "", ...props }, ref) => {
    const { imageStatus, setImageStatus } = useAvatarContext("AvatarImage");

    return (
      <img
        ref={ref}
        alt={alt}
        className={cn(
          "aspect-square h-full w-full object-cover transition-opacity duration-200",
          imageStatus === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => {
          setImageStatus("loaded");
          onLoad?.(e);
        }}
        onError={(e) => {
          setImageStatus("error");
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

export type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { imageStatus } = useAvatarContext("AvatarFallback");
    const show = imageStatus !== "loaded";

    return (
      <span
        ref={ref}
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
          !show && "hidden",
          className
        )}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
