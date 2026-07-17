import { Skeleton } from "@/components/ui/Feedback";

export default function StaffLoading() {
  return (
    <div className="animate-[staff-fade-in_280ms_cubic-bezier(0.32,0.72,0,1)_both] space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="h-10 w-1/2 max-w-lg rounded-xl" />
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
