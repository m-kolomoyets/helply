import { useEffect, useRef, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { CheckIcon, CopyIcon, QrCodeIcon } from "lucide-react"
import QRCode from "qrcode"
import { toast } from "sonner"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { qrFormSchema, qrSearchSchema, urlFieldSchema } from "@/lib/qr-schema"

const QR_DISPLAY_SIZE = 256
const QR_RENDER_SCALE = 2

export const Route = createFileRoute("/_app/qr")({
  component: QrPage,
  ssr: false,
  staticData: { title: "QR Code" },
  validateSearch: qrSearchSchema,
})

async function renderQr(canvas: HTMLCanvasElement, value: string) {
  await QRCode.toCanvas(canvas, value, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: QR_DISPLAY_SIZE * QR_RENDER_SCALE,
    color: { dark: "#000000", light: "#ffffff" },
  })
  canvas.style.width = `${QR_DISPLAY_SIZE}px`
  canvas.style.height = `${QR_DISPLAY_SIZE}px`
}

async function copyCanvasToClipboard(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  )
  if (!blob) throw new Error("Failed to encode PNG")

  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
}

function downloadCanvas(canvas: HTMLCanvasElement) {
  const url = canvas.toDataURL("image/png")
  const a = document.createElement("a")
  a.href = url
  a.download = "qr-code.png"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function QrPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const form = useAppForm({
    defaultValues: { url: search.url ?? "" },
    validators: { onChange: qrFormSchema, onSubmit: qrFormSchema },
    onSubmit({ value }) {
      generate(value.url)
      void navigate({ search: { url: value.url }, replace: true })
    },
  })

  function generate(value: string) {
    const canvas = canvasRef.current
    if (!canvas) return
    renderQr(canvas, value)
      .then(() => setHasGenerated(true))
      .catch(() => toast.error("Failed to generate QR code"))
  }

  useEffect(() => {
    if (!search.url) return
    const parsed = urlFieldSchema.safeParse(search.url)
    if (!parsed.success) return
    generate(parsed.data)
  }, [])

  async function handleCopy() {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      await copyCanvasToClipboard(canvas)
      setCopied(true)
      toast.success("Copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      downloadCanvas(canvas)
      toast.message("Downloaded instead", {
        description: "Clipboard image copy is not supported here.",
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Enter a URL and generate a scannable QR code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="qr-form"
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.AppField
              name="url"
              children={(field) => (
                <field.FormFieldWrapper label="URL">
                  <field.InputField
                    placeholder="example.com"
                    autoComplete="off"
                    inputMode="url"
                  />
                </field.FormFieldWrapper>
              )}
            />
            <div className="flex justify-center pt-2">
              <QrPreview ref={canvasRef} visible={hasGenerated} />
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  Generate
                </Button>
              )}
            />
          </form>
        </CardContent>
        {hasGenerated ? (
          <CardFooter className="justify-end">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <CheckIcon className="size-4" /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className="size-4" /> Copy
                </>
              )}
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

function QrPreview({
  ref,
  visible,
}: {
  ref: React.RefObject<HTMLCanvasElement | null>
  visible: boolean
}) {
  return (
    <div
      className="relative flex items-center justify-center rounded-md"
      style={{ width: QR_DISPLAY_SIZE, height: QR_DISPLAY_SIZE }}
    >
      {!visible ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
          <QrCodeIcon className="size-12" />
        </div>
      ) : null}
      <canvas
        ref={ref}
        aria-label="Generated QR code"
        style={{
          width: QR_DISPLAY_SIZE,
          height: QR_DISPLAY_SIZE,
          display: visible ? "block" : "none",
        }}
      />
    </div>
  )
}
