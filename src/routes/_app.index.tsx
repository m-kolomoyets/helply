import { Link, createFileRoute } from "@tanstack/react-router"
import { CalendarDaysIcon, QrCodeIcon } from "lucide-react"

export const Route = createFileRoute("/_app/")({
  component: Home,
  staticData: { title: "Home" },
})

const tools = [
  {
    to: "/qr",
    title: "QR Code",
    description: "Generate a QR code from a link.",
    icon: QrCodeIcon,
  },
  {
    to: "/dates",
    title: "Dates",
    description: "List dates in a range, excluding weekends.",
    icon: CalendarDaysIcon,
  },
] as const

function Home() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tools.map((tool) => (
        <Link
          key={tool.to}
          to={tool.to}
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <tool.icon className="size-5 text-muted-foreground group-hover:text-foreground" />
            <h2 className="font-medium">{tool.title}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {tool.description}
          </p>
        </Link>
      ))}
    </div>
  )
}
