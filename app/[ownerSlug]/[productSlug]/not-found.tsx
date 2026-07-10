import { NotFoundPage } from "@/components/not-found-page"

export default function NotFound() {
  return (
    <NotFoundPage
      heading="Changelog not found"
      description="This changelog doesn't exist or is no longer public. Check the URL or head back home."
      actionLabel="Go home"
    />
  )
}
