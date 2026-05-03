import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/dates")({
  component: DatesPage,
  staticData: { title: "Dates" },
})

function DatesPage() {
  return (
    <p className="text-sm text-muted-foreground">
      Weekday-only date list generator.
    </p>
  )
}
