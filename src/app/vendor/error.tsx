"use client";
import { Button,Card,EmptyState } from "@/components/portal/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Card>
      <EmptyState
        title="Something interrupted your workspace"
        description="Please try again. Your saved changes are safe."
        action={<Button onClick={reset}>Try again</Button>}
      />
    </Card>
  );
}
