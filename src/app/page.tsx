import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Gem,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";

const capabilities = [
  {
    icon: LayoutDashboard,
    number: "01",
    title: "A calmer command center",
    description:
      "See enquiries, upcoming celebrations, and business performance in one considered workspace.",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Conversations with context",
    description:
      "Keep every couple, brief, and follow-up beautifully organized from first note to final detail.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Growth you can see",
    description:
      "Understand visibility, profile strength, and lead quality without losing time to busywork.",
  },
];

const trustPoints = [
  "Curated partner network",
  "Private, secure workspace",
  "Human concierge support",
];

export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-hidden bg-background text-foreground">
      <section className="hero-shell relative isolate min-h-[760px] lg:min-h-screen">
        <div className="hero-grain absolute inset-0 -z-10" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />

        <nav className="landing-nav mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-14 lg:py-8" aria-label="Main navigation">
          <Link href="/" className="group flex items-center gap-3" aria-label="Vellure home">
            <span className="flex size-10 items-center justify-center rounded-full border border-gold/35 bg-white/5 text-gold transition-transform duration-500 group-hover:rotate-12">
              <Gem className="size-[18px]" strokeWidth={1.5} />
            </span>
            <span>
              <span className="block font-serif text-[1.7rem] font-semibold leading-none tracking-[-0.03em] text-white">Vellure</span>
              <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.34em] text-gold">Partner atelier</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm text-white/65 md:flex">
            <a className="nav-link" href="#experience">Experience</a>
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#membership">Membership</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:text-white sm:block">
              Sign in
            </Link>
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#321b20] shadow-[0_12px_40px_rgba(210,173,107,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0bf83] sm:px-5">
              Join Vellure
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-14 lg:pb-24 lg:pt-20 xl:pt-28">
          <div className="hero-copy max-w-2xl">
            <div className="reveal-up inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e8cf9f] backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              The business of beautiful celebrations
            </div>
            <h1 className="reveal-up reveal-delay-1 mt-8 max-w-[680px] font-serif text-[clamp(3.4rem,7vw,6.7rem)] font-medium leading-[0.91] tracking-[-0.055em] text-white">
              Your craft,
              <span className="block italic text-gold">beautifully</span>
              in command.
            </h1>
            <p className="reveal-up reveal-delay-2 mt-8 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              A refined workspace for exceptional wedding professionals. Manage enquiries, shape your presence, and grow with intention.
            </p>
            <div className="reveal-up reveal-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gold px-7 text-sm font-bold text-[#2f1820] shadow-[0_16px_50px_rgba(210,173,107,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e1c083]">
                Become a Vellure partner
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#experience" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-7 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]">
                Explore the experience
                <ChevronRight className="size-4 text-gold" />
              </a>
            </div>
            <div className="reveal-up reveal-delay-4 mt-11 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6">
              {trustPoints.map((point) => (
                <span key={point} className="flex items-center gap-2 text-xs text-white/48">
                  <Check className="size-3.5 text-gold" strokeWidth={2.5} />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal-scale relative mx-auto w-full max-w-[700px] lg:ml-auto">
            <div className="absolute -inset-10 rounded-full bg-gold/[0.06] blur-3xl" aria-hidden="true" />
            <div className="dashboard-preview relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#fbf8f1] p-2.5 shadow-[0_40px_100px_rgba(12,3,7,0.45)] sm:p-3">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#f8f4ec]">
                <div className="flex items-center justify-between border-b border-[#e9e1d4] bg-white/80 px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-burgundy text-gold">
                      <Gem className="size-3.5" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#251b1e]">Vellure</p>
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9a8f85]">Partner workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden rounded-full border border-[#e8dfd2] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#756b63] sm:block">Preview</span>
                    <div className="size-8 rounded-full bg-[linear-gradient(145deg,#d7b979,#7b183e)] ring-2 ring-white" />
                  </div>
                </div>

                <div className="grid min-h-[430px] grid-cols-[58px_1fr] sm:grid-cols-[150px_1fr]">
                  <aside className="border-r border-[#e9e1d4] bg-[#f2ece2] p-3 sm:p-5">
                    <p className="mb-5 hidden text-[8px] font-bold uppercase tracking-[0.18em] text-[#a69b90] sm:block">Overview</p>
                    <div className="space-y-2">
                      {[
                        [LayoutDashboard, "Home", true],
                        [UsersRound, "Enquiries", false],
                        [CalendarDays, "Schedule", false],
                        [Star, "Portfolio", false],
                      ].map(([Icon, label, active]) => {
                        const MenuIcon = Icon as typeof LayoutDashboard;
                        return (
                          <div key={label as string} className={`flex items-center gap-2.5 rounded-xl p-2.5 text-[10px] font-semibold ${active ? "bg-white text-burgundy shadow-sm" : "text-[#8d8178]"}`}>
                            <MenuIcon className="size-4 shrink-0" />
                            <span className="hidden sm:inline">{label as string}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-24 hidden rounded-2xl bg-burgundy p-4 text-white sm:block">
                      <Sparkles className="size-4 text-gold" />
                      <p className="mt-3 font-serif text-sm leading-4">Concierge care</p>
                      <p className="mt-2 text-[8px] leading-3 text-white/55">We are here whenever you need us.</p>
                    </div>
                  </aside>

                  <div className="p-4 sm:p-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-burgundy/55">Wednesday, 29 August</p>
                        <h2 className="mt-2 font-serif text-xl font-semibold tracking-[-0.02em] text-[#281d20] sm:text-2xl">Good morning, Atelier Rose</h2>
                      </div>
                      <span className="hidden rounded-full bg-[#ece3d5] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-burgundy sm:block">Verified partner</span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        ["New enquiries", "12", "+18%"],
                        ["Profile views", "2.4k", "+24%"],
                        ["Celebrations", "08", "This month"],
                      ].map(([label, value, change], index) => (
                        <div key={label} className={`rounded-2xl border border-[#e9e1d4] p-4 ${index === 2 ? "hidden bg-burgundy text-white sm:block" : "bg-white"}`}>
                          <p className={`text-[8px] font-bold uppercase tracking-wider ${index === 2 ? "text-white/50" : "text-[#9b8f85]"}`}>{label}</p>
                          <p className="mt-3 font-serif text-2xl font-semibold">{value}</p>
                          <p className={`mt-2 text-[8px] font-bold ${index === 2 ? "text-gold" : "text-[#968264]"}`}>{change}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[1.35fr_0.65fr]">
                      <div className="rounded-2xl border border-[#e9e1d4] bg-white p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#94887f]">Enquiry activity</p>
                            <p className="mt-1 font-serif text-sm font-semibold">A promising week</p>
                          </div>
                          <span className="rounded-full bg-[#f5eee2] p-2 text-burgundy"><TrendingUp className="size-3.5" /></span>
                        </div>
                        <div className="mt-8 flex h-24 items-end gap-2" aria-label="Decorative enquiry activity chart">
                          {[36, 52, 42, 72, 56, 88, 68, 94].map((height, index) => (
                            <span key={index} className={`chart-bar flex-1 rounded-t-full ${index === 7 ? "bg-burgundy" : "bg-[#dfcda9]"}`} style={{ height: `${height}%`, animationDelay: `${0.7 + index * 0.06}s` }} />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[#e6d4ad] p-5 text-[#34252a]">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/45">
                          <ShieldCheck className="size-4 text-burgundy" />
                        </div>
                        <p className="mt-5 font-serif text-lg font-semibold leading-5">Your profile is shining.</p>
                        <p className="mt-3 text-[9px] leading-4 text-[#66584d]">You are in the top 8% of partners this week.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card absolute -bottom-7 -left-3 hidden items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 pr-5 shadow-[0_18px_50px_rgba(20,5,10,0.2)] backdrop-blur md:flex">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#f1e5cc] text-burgundy"><CalendarDays className="size-4" /></span>
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#9a8f86]">Next celebration</span>
                <span className="mt-1 block font-serif text-sm font-semibold text-[#2f2226]">The Mehta Wedding · 4 days</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="border-b border-[#eadfce] bg-[#f8f3ea]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-14">
          {[
            ["250+", "Selected creative partners"],
            ["18", "Wedding disciplines represented"],
            ["4.9 / 5", "Average partner experience"],
          ].map(([value, label]) => (
            <div key={label} className="flex items-center gap-5 sm:justify-center sm:border-r sm:border-[#ded1bd] sm:last:border-r-0">
              <p className="font-serif text-3xl font-semibold tracking-tight text-burgundy lg:text-4xl">{value}</p>
              <p className="max-w-[140px] text-[10px] font-bold uppercase leading-4 tracking-[0.14em] text-[#80746b]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="platform" className="bg-[#fdfbf7] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">Designed around your standards</p>
              <h2 className="mt-5 max-w-xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.045em] text-[#2d2024] sm:text-5xl lg:text-6xl">
                The quiet confidence of being organized.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#746a63] lg:justify-self-end lg:text-lg lg:leading-8">
              Vellure brings the essential parts of your wedding business together with clarity, warmth, and none of the clutter.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-[#e9dfd1] lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, number, title, description }) => (
              <article key={title} className="feature-card group relative min-h-[330px] bg-[#fdfbf7] p-8 transition-colors duration-500 hover:bg-white lg:p-10">
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full border border-[#dfd2be] text-burgundy transition-all duration-500 group-hover:border-burgundy group-hover:bg-burgundy group-hover:text-gold">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-serif text-sm italic text-[#b4a99e]">{number}</span>
                </div>
                <div className="mt-20">
                  <h3 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#312327]">{title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-[#786e67]">{description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100">
                    Discover more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="relative overflow-hidden bg-[#efe3cf] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
        <div className="membership-ring membership-ring-one" aria-hidden="true" />
        <div className="membership-ring membership-ring-two" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div>
            <p className="eyebrow">Membership, thoughtfully curated</p>
            <h2 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.05em] text-[#321f26] sm:text-6xl lg:text-7xl">
              Built for people who make moments feel <em className="font-medium text-burgundy">extraordinary.</em>
            </h2>
          </div>
          <div className="rounded-[2rem] border border-white/60 bg-white/55 p-7 shadow-[0_24px_80px_rgba(74,35,44,0.08)] backdrop-blur-md sm:p-9">
            <div className="flex items-center gap-1 text-burgundy">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-4 fill-current" />)}
            </div>
            <blockquote className="mt-6 font-serif text-2xl leading-9 tracking-[-0.02em] text-[#34262a]">
              “Vellure lets us spend less time managing the work, and more time making it unforgettable.”
            </blockquote>
            <div className="mt-8 flex items-center gap-3 border-t border-burgundy/10 pt-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-burgundy font-serif text-sm text-gold">AR</div>
              <div>
                <p className="text-sm font-bold text-[#34262a]">Aarav Rao</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#847269]">Creative Director, Atelier Rose</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-burgundy px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Your next chapter</p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Bring more intention to every celebration.</h2>
          </div>
          <Link href="/register" className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-gold px-7 text-sm font-bold text-[#30191f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e3c487] lg:self-auto">
            Apply for partnership
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mx-auto mt-20 flex max-w-[1320px] flex-col gap-6 border-t border-white/12 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Gem className="size-4 text-gold" />
            <span className="font-serif text-lg font-semibold text-white">Vellure</span>
            <span>Partner Atelier</span>
          </div>
          <p>© 2026 Vellure. Crafted for remarkable professionals.</p>
        </div>
      </section>
    </main>
  );
}
