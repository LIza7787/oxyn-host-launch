import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type FormEvent } from "react";
import {
  Activity, ArrowRight, Bot, Check, ChevronRight, CircleCheck, Cloud,
  Github, Globe2, Menu, Server, ShieldCheck, Sparkles, Terminal,
  Twitter, X, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendTelegramOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "OxynHost | High-Performance Cloud Hosting" },
    { name: "description", content: "Deploy websites and applications in seconds with NVMe KVM hosting, DDoS protection, and AI diagnostics." },
    { property: "og:title", content: "OxynHost | High-Performance Cloud Hosting" },
    { property: "og:description", content: "Fast, secure cloud infrastructure without setup complexity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

type PlanName = "Website Hosting" | "Virtual Servers" | "Dedicated Servers";

const plans: Array<{ name: PlanName; price: number; description: string; icon: typeof Cloud; features: string[]; popular?: boolean }> = [
  { name: "Website Hosting", price: 1.99, icon: Globe2, description: "Fast, managed hosting for personal and commercial sites.", features: ["Managed by Plesk", "High-performance storage", "DDoS protected"] },
  { name: "Virtual Servers", price: 2.99, icon: Server, popular: true, description: "Flexible compute with complete control and instant scaling.", features: ["KVM virtualization", "Automated backups", "Full root control"] },
  { name: "Dedicated Servers", price: 29.99, icon: Activity, description: "Bare-metal power managed through the TenantOS control panel.", features: ["Dedicated enterprise hardware", "TenantOS control panel", "Built for extreme demands"] },
];

function Index() {
  const sendOrder = useServerFn(sendTelegramOrder);
  const [yearly, setYearly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("Virtual Servers");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [sending, setSending] = useState(false);
  const challenge = useMemo(() => ({ a: 4 + Math.floor(Math.random() * 4), b: 2 + Math.floor(Math.random() * 5) }), [modalOpen]);

  const openOrder = (plan: PlanName) => { setSelectedPlan(plan); setCaptcha(""); setModalOpen(true); };
  const checkDomain = (event: FormEvent) => {
    event.preventDefault();
    const clean = domain.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,62}\.[a-z]{2,}$/.test(clean)) {
      toast.error("Enter a valid domain name.");
      return;
    }
    toast.success(`${clean} is available!`, { description: "Secure it before someone else does." });
  };
  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (Number(captcha) !== challenge.a + challenge.b) {
      toast.error("That answer isn’t correct. Please try again.");
      return;
    }
    if (!isValidContact(contact)) {
      toast.error("Enter a valid email or Telegram username (e.g. alex@company.com or @alex).");
      return;
    }
    setSending(true);
    try {
      await sendOrder({ data: { plan: selectedPlan, name, contact } });
      toast.success("Order sent successfully! We will contact you shortly.");
      setModalOpen(false); setName(""); setContact(""); setCaptcha("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your order. Please try again.");
    } finally { setSending(false); }
  };

  return <div className="min-h-screen overflow-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-lg font-extrabold"><span className="text-primary drop-shadow-[0_0_12px_var(--primary)]">⚡</span> OxynHost</a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex" aria-label="Main navigation">
          {["Services", "Domain Check", "Pricing", "AI Diagnostics", "Docs"].map((item) => <a key={item} href={item === "Pricing" ? "#pricing" : item === "Domain Check" ? "#domain" : item === "AI Diagnostics" ? "#features" : "#features"} className="transition-colors hover:text-foreground">{item}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex"><Button variant="ghost">Log In</Button><Button variant="glow" onClick={() => openOrder("Virtual Servers")}>Deploy Now <ArrowRight /></Button></div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">{["Services", "Domain Check", "Pricing", "AI Diagnostics", "Docs"].map((item) => <a key={item} href={item === "Pricing" ? "#pricing" : "#features"} onClick={() => setMenuOpen(false)} className="block py-3 text-sm text-muted-foreground">{item}</a>)}</nav>}
    </header>

    <main id="top">
      <section className="relative mx-auto grid min-h-[820px] max-w-7xl items-center gap-16 px-5 pb-20 pt-32 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 grid-surface opacity-25" />
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary"><Zap className="size-3" /> NVMe KVM Powered Infrastructure</div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">High-Performance Cloud Hosting with <span className="text-primary">Zero Setup Complexity.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">Deploy your websites and applications in seconds with automated Anti-DDoS protection, 99.99% uptime, and smart AI server diagnostics.</p>
          <form id="domain" onSubmit={checkDomain} className="glass-panel mt-9 max-w-2xl rounded-lg p-2.5">
            <div className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Globe2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Search domain (e.g. project.oxyn)..." className="h-12 border-0 bg-transparent pl-10 shadow-none" aria-label="Domain name" /></div><Button type="submit" variant="glow" className="h-12">Check Availability <ChevronRight /></Button></div>
            <div className="flex flex-wrap gap-2 px-1 pt-3">{[".com £8.99/yr", ".io £24.99/yr", ".dev £10.99/yr", ".uk £4.99/yr"].map((t) => <span key={t} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{t}</span>)}</div>
          </form>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-xl">
          <div className="absolute -inset-8 bg-primary/10 blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-destructive"/><span className="size-2.5 rounded-full bg-chart-4"/><span className="size-2.5 rounded-full bg-success"/></div><span className="font-mono text-[11px] text-muted-foreground">deploy.oxyn / terminal</span><Terminal className="size-4 text-primary"/></div>
            <div className="space-y-5 p-5 sm:p-7">
              <div className="grid gap-2 sm:grid-cols-3">{[
                { value: "Operational", label: "Status", Icon: CircleCheck },
                { value: "1.2s", label: "Deploy speed", Icon: Zap },
                { value: "Active", label: "DDoS shield", Icon: ShieldCheck },
              ].map(({ value, label, Icon }) => <div key={value} className="rounded-md border border-border bg-background/50 p-3"><Icon className="mb-3 size-4 text-primary"/><span className="block text-[10px] uppercase text-muted-foreground">{label}</span><b className="mt-1 block font-mono text-xs">{value}</b></div>)}</div>
              <div className="rounded-md border border-border bg-background/70 p-5 font-mono text-xs leading-7 text-muted-foreground">
                <p className="animate-[terminal-line_.4s_ease-out] text-foreground"><span className="text-primary">$</span> git push oxyn main</p>
                <p className="animate-[terminal-line_.4s_.35s_both]">→ Building project...</p>
                <p className="animate-[terminal-line_.4s_.7s_both]">→ Provisioning edge network...</p>
                <p className="animate-[terminal-line_.4s_1.05s_both] text-success">✓ Deployment live in 1.2s</p>
                <p className="animate-[terminal-line_.4s_1.4s_both] text-primary">https://project.oxyn.host <span className="inline-block animate-[pulse-soft_1s_infinite]">▋</span></p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>fra-01 · NVMe cluster</span><span className="flex items-center gap-1.5 text-success"><span className="size-1.5 rounded-full bg-success"/> All systems nominal</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8"><div className="glass-panel grid rounded-lg sm:grid-cols-2 lg:grid-cols-4">{[["99.99%", "Uptime SLA"], ["< 8ms", "Global Latency"], ["120K+", "Active Projects Hosted"], ["24/7/365", "Expert Support"]].map(([value,label], i) => <div key={label} className={`p-6 text-center ${i ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}><strong className="font-mono text-2xl text-foreground">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{label}</span></div>)}</div></section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <div className="mb-12 max-w-2xl"><span className="font-mono text-xs uppercase text-primary">Infrastructure, evolved</span><h2 className="mt-4 text-3xl font-bold sm:text-5xl">Built on Enterprise-Grade Hardware.</h2><p className="mt-4 text-muted-foreground">A resilient platform engineered for speed, security, and intelligent operations.</p></div>
        <div className="grid gap-4 md:grid-cols-3">{[
          { Icon: Server, title: "KVM Virtualization", text: "Enterprise-grade hardware VPS for general purpose computing with automated backups." },
          { Icon: ShieldCheck, title: "Robust Anti-DDoS", text: "Continuous real-time traffic filtering with automatic mitigation." },
          { Icon: Bot, title: "Oxyn AI Diagnostics", text: "Built-in AI log analyzer for zero-downtime server performance optimization." },
        ].map(({ Icon, title, text }) => <article key={title} className="group glass-panel rounded-lg p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/40"><div className="mb-8 flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10"><Icon className="size-5 text-primary"/></div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p><div className="mt-8 h-px w-12 bg-primary/50 transition-all group-hover:w-24"/></article>)}</div>
      </section>

      <section id="pricing" className="border-y border-border bg-card/20 py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><span className="font-mono text-xs uppercase text-primary">Simple pricing</span><h2 className="mt-4 text-3xl font-bold sm:text-5xl">Affordable & Transparent Infrastructure.</h2><p className="mt-4 text-muted-foreground">High performance enterprise hardware without hidden fees.</p></div><div className="inline-flex w-fit items-center rounded-md border border-border bg-background p-1" aria-label="Billing period"><Button variant={!yearly ? "secondary" : "ghost"} size="sm" onClick={() => setYearly(false)}>Monthly</Button><Button variant={yearly ? "secondary" : "ghost"} size="sm" onClick={() => setYearly(true)}>Yearly <span className="text-primary">Save 20%</span></Button></div></div>
        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">{plans.map((plan) => { const price = yearly ? plan.price * .8 : plan.price; const Icon = plan.icon; return <article key={plan.name} className={`relative flex flex-col rounded-lg border p-7 transition duration-300 hover:-translate-y-1 ${plan.popular ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border bg-card/50"}`}>{plan.popular && <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">POPULAR</span>}<Icon className="size-6 text-primary"/><h3 className="mt-7 text-xl font-semibold">{plan.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-muted-foreground">{plan.description}</p><div className="my-7"><span className="text-sm text-muted-foreground">Starting from </span><strong className="text-4xl">£{price.toFixed(2)}</strong><span className="text-sm text-muted-foreground">/mo</span>{yearly && <span className="mt-1 block text-xs text-primary">Billed £{(price * 12).toFixed(2)} yearly</span>}</div><ul className="mb-8 space-y-3">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-primary"/>{f}</li>)}</ul><Button variant={plan.popular ? "glow" : "glass"} className="mt-auto w-full" onClick={() => openOrder(plan.name)}>Order Now <ArrowRight /></Button></article>})}</div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="relative overflow-hidden rounded-lg border border-primary/30 bg-primary/10 px-6 py-16 text-center shadow-[var(--shadow-glow)]"><Sparkles className="mx-auto mb-5 size-7 text-primary"/><h2 className="text-3xl font-bold sm:text-5xl">Ready to migrate to OxynHost?</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Move faster on infrastructure built to disappear into the background.</p><Button variant="glow" size="lg" className="mt-8" onClick={() => openOrder("Virtual Servers")}>Get Started Now <ArrowRight /></Button></div></section>
    </main>

    <footer className="border-t border-border"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8"><div><a href="#top" className="text-lg font-bold"><span className="text-primary">⚡</span> OxynHost</a><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Cloud infrastructure without the operational drag.</p></div>{[["Platform", "Services", "Pricing", "Domain Check"], ["Resources", "Documentation", "Status", "AI Diagnostics"], ["Company", "About", "Contact", "Legal"]].map(([heading,...links]) => <div key={heading}><h3 className="text-sm font-semibold">{heading}</h3><div className="mt-4 space-y-3">{links.map(l => <a key={l} href={l === "Pricing" ? "#pricing" : "#features"} className="block text-sm text-muted-foreground hover:text-foreground">{l}</a>)}</div></div>)}</div><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8"><span>© 2026 OxynHost Inc. All rights reserved.</span><div className="flex gap-2"><Button variant="ghost" size="icon" aria-label="GitHub"><Github/></Button><Button variant="ghost" size="icon" aria-label="Telegram"><Zap/></Button><Button variant="ghost" size="icon" aria-label="Twitter"><Twitter/></Button></div></div></footer>

    <Dialog open={modalOpen} onOpenChange={setModalOpen}><DialogContent className="glass-panel max-w-md border-primary/20"><DialogHeader><DialogTitle className="text-2xl">Launch with OxynHost</DialogTitle><DialogDescription>Tell us where to reach you. Our team will respond shortly.</DialogDescription></DialogHeader><form onSubmit={submitOrder} className="mt-3 space-y-5"><label className="block text-sm font-medium">Selected plan<Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanName)}><SelectTrigger className="mt-2 h-11"><SelectValue/></SelectTrigger><SelectContent>{plans.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}</SelectContent></Select></label><label className="block text-sm font-medium">Customer name<Input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11" placeholder="Alex Morgan" /></label><label className="block text-sm font-medium">Email or Telegram username<Input required minLength={3} maxLength={255} value={contact} onChange={(e) => setContact(e.target.value)} className="mt-2 h-11" placeholder="alex@company.com or @alex" /></label><label className="block text-sm font-medium">What is {challenge.a} + {challenge.b}?<Input required inputMode="numeric" pattern="[0-9]*" value={captcha} onChange={(e) => setCaptcha(e.target.value)} className="mt-2 h-11" placeholder="Your answer" /></label><Button type="submit" variant="glow" className="h-11 w-full" disabled={sending}>{sending ? "Sending order..." : "Send Order"} {!sending && <ArrowRight/>}</Button></form></DialogContent></Dialog>
  </div>;
}
