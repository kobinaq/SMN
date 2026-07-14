import { Skeleton } from "@/components/ui/Feedback";

export default function StaffLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-1/2 max-w-lg" />
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
