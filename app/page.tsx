import Link from "next/link"
import { BrandHeader } from "@/components/brand/brand-header"
import { PigeonLogo } from "@/components/brand/pigeon-logo"
import { Button } from "@/components/ui/button"
import { Zap, Globe, Code, Clock, Heart, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A7D8FF]/20 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-60 h-60 bg-[#FFB8A1]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#BFEBD6]/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A7D8FF]/20 border border-[#A7D8FF]/30 text-sm font-medium text-foreground mb-8">
              <Sparkles className="w-4 h-4 text-[#FFB8A1]" />
              Built for indie devs who ship fast
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight text-balance">
              Your users deserve to know <span className="text-[#FFB8A1]">what{"'"}s new</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
              Stop burying updates in Discord or Twitter. Give your product a beautiful, public changelog that keeps
              users excited and informed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                asChild
                size="lg"
                className="bg-[#FFB8A1] text-[#1F2937] hover:bg-[#ffa78a] shadow-lg shadow-[#FFB8A1]/25 text-base px-8 h-12"
              >
                <Link href="/auth/sign-up">
                  Create your changelog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 border-2 bg-transparent">
                <Link href="/demo">See a live example</Link>
              </Button>
            </div>

            {/* Social proof */}
            <p className="text-sm text-muted-foreground">Free to start. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-20 bg-[#F7FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">Sound familiar?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                emoji: "😅",
                title: '"Where did I post that update?"',
                desc: "Twitter, Discord, email... your updates are scattered everywhere. Users miss the good stuff.",
              },
              {
                emoji: "🙈",
                title: '"I shipped 20 features last month"',
                desc: "But nobody knows. You're too busy building to write fancy release notes.",
              },
              {
                emoji: "😤",
                title: '"Is this app even maintained?"',
                desc: "Without visible updates, users assume the worst. Trust erodes silently.",
              },
            ].map((pain, i) => (
              <div key={i} className="bg-background rounded-xl p-6 border border-border/50 shadow-sm">
                <span className="text-4xl mb-4 block">{pain.emoji}</span>
                <h3 className="font-semibold text-foreground mb-2">{pain.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#BFEBD6]/30 border border-[#BFEBD6]/50 mb-6">
              <PigeonLogo size="md" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              PatchPigeon delivers your changelog
            </h2>
            <p className="text-lg text-muted-foreground">
              A beautiful home for all your updates. Takes 2 minutes to set up.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Feature List */}
            <div className="space-y-6">
              {[
                {
                  icon: Clock,
                  title: "Ship updates in seconds",
                  desc: "Markdown editor with live preview. Write once, publish instantly.",
                  color: "bg-[#A7D8FF]/20 text-[#1F2937]",
                },
                {
                  icon: Globe,
                  title: "One public link, infinite reach",
                  desc: "Share your changelog URL anywhere. No sign-up required for readers.",
                  color: "bg-[#FFB8A1]/20 text-[#1F2937]",
                },
                {
                  icon: Code,
                  title: "Simple REST API",
                  desc: "Fetch your changelog as JSON or RSS. Build custom integrations.",
                  color: "bg-[#BFEBD6]/20 text-[#1F2937]",
                },
                {
                  icon: Zap,
                  title: "Zero maintenance",
                  desc: "We handle hosting, performance, and uptime. You just write.",
                  color: "bg-[#FFE7A3]/20 text-[#1F2937]",
                },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Card */}
            <div className="relative">
              <div className="bg-background rounded-2xl border border-border shadow-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono">
                      patchpigeon.app/your-product
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#A7D8FF]/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#1F2937]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Acme App</h4>
                      <p className="text-xs text-muted-foreground">Changelog</p>
                    </div>
                  </div>

                  {/* Sample entries */}
                  <div className="space-y-4">
                    {[
                      {
                        type: "Feature",
                        title: "Dark mode is here!",
                        date: "Jan 6, 2025",
                        color: "bg-[#BFEBD6] text-[#1F2937]",
                      },
                      {
                        type: "Fix",
                        title: "Fixed login issues on Safari",
                        date: "Jan 4, 2025",
                        color: "bg-[#FFE7A3] text-[#1F2937]",
                      },
                      {
                        type: "Improvement",
                        title: "Faster dashboard loading",
                        date: "Jan 2, 2025",
                        color: "bg-[#A7D8FF] text-[#1F2937]",
                      },
                    ].map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.color}`}>
                          {entry.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{entry.title}</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-[#A7D8FF]/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#F7FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Up and running in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Create your product",
                desc: "Name it, describe it, get your unique changelog URL.",
                color: "bg-[#A7D8FF]",
              },
              {
                step: "2",
                title: "Write your first entry",
                desc: "Use our markdown editor with live preview. Publish when ready.",
                color: "bg-[#FFB8A1]",
              },
              {
                step: "3",
                title: "Share the link",
                desc: "Add it to your app, website, or social bio. Done!",
                color: "bg-[#BFEBD6]",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className={`w-14 h-14 rounded-2xl ${item.color} text-[#1F2937] font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm`}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <PigeonLogo size="lg" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              Your changelog, delivered.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join indie developers who keep their users in the loop.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#FFB8A1] text-[#1F2937] hover:bg-[#ffa78a] shadow-lg shadow-[#FFB8A1]/25 text-base px-8 h-12"
            >
              <Link href="/auth/sign-up">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Heart className="w-4 h-4 text-[#FFB8A1]" />
              Made with love for indie devs
            </div>
            <div className="flex items-center gap-2">
              <PigeonLogo size="sm" />
              <span className="text-sm font-medium text-foreground">PatchPigeon</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
