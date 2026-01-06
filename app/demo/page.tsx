import { redirect } from "next/navigation"

// Redirect /demo to /demo/acme-app
export default function DemoRedirectPage() {
  redirect("/demo/acme-app")
}
