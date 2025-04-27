import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse duration-300 rounded-md bg-primary/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
