// export const runtime = 'edge';
import Image from "next/image"
import Link from "next/link"

const studioStats = [
  { label: "Master artisans", value: "120+" },
  { label: "Hand-finished shawls", value: "6,000+" },
  { label: "Villages supported", value: "14" },
]

const craftPillars = [
  {
    title: "Loom-to-life craftsmanship",
    description:
      "Every shawl is handloomed in small batches in Charsadda, then finished with hand-rolled edges, tassels, and natural block prints.",
  },
  {
    title: "Ethical fibre partnerships",
    description:
      "We source wool directly from shepherd families in Swat and Gilgit, guaranteeing fair pricing and veterinary care for flocks.",
  },
  {
    title: "Slow fashion by design",
    description:
      "We release seasonal edits only when workshops are ready—prioritising artisans’ wellbeing and zero-inventory waste.",
  },
]

const timeline = [
  {
    year: "1992",
    title: "A family studio opens",
    description:
      "Founded by the Khan siblings to preserve regional weaving patterns at risk of disappearing.",
  },
  {
    year: "2008",
    title: "First export capsule",
    description:
      "Partnered with craft councils across Europe to showcase heirloom-quality shawls abroad.",
  },
  {
    year: "2018",
    title: "Women apprenticeships",
    description:
      "Launched the Siraj Center where 40+ women now learn spinning, dyeing, and finishing techniques.",
  },
  {
    year: "2023",
    title: "Digital studio",
    description:
      "Brought the in-store curation experience online with private shopping, video fittings, and bespoke orders.",
  },
]

const leadership = [
  {
    name: "Hadiqa Khan",
    role: "Creative Director",
    quote:
      "“A Khyber shawl is meant to be lived in—draped over denim at sunrise, or paired with velvet at weddings.”",
    image: "/uploads/1762160790489-s3qd3-Icon-Khyber-Shawl-(1).png",
  },
  {
    name: "Hamza Khan",
    role: "Master Weaver",
    quote:
      "“I still inspect every warp and weft before it leaves the loom. We owe that devotion to our ancestors.”",
    image: "/uploads/kh-open.avif",
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="grid gap-10 overflow-hidden rounded-[32px] border bg-card/70 shadow-lg md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6 px-8 py-12 sm:px-12">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-600">About Khyber Shawls</p>
          <h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
            A legacy studio weaving warmth from the valleys of Khyber Pakhtunkhwa.
          </h1>
          <p className="text-base text-gray-600">
            Our family-run studio brings together custodians of block-printing, vegetable dyeing, and hand
            weaving. We strive to keep ancestral skills alive while designing silhouettes that belong in
            today’s wardrobes—minimalist, elevated, and unapologetically Pakistani.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {studioStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-amber-100 bg-white p-4 text-center">
                <p className="text-3xl font-semibold text-amber-700">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-96 md:h-full">
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
            alt="Artisan working on handloom"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute left-6 top-6 rounded-2xl bg-white/90 p-4 text-xs font-semibold uppercase tracking-[0.4em] text-gray-600">
            Handloomed in Charsadda
          </div>
        </div>
      </section>

      {/* Craft pillars */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">House philosophy</p>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">What defines our studio</h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600">
            Each collection is a collaboration between designers, artisans, historians, and the communities that
            raise the sheep whose wool we transform into heirlooms.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {craftPillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[28px] border border-amber-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-amber-700">{pillar.title}</p>
              <p className="mt-3 text-sm text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="grid gap-6 rounded-[32px] bg-gradient-to-r from-amber-50 to-white p-10 lg:grid-cols-2">
        {leadership.map((leader) => (
          <div key={leader.name} className="flex flex-col gap-4 rounded-3xl border bg-white/80 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-amber-100">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{leader.name}</p>
                <p className="text-sm text-gray-500">{leader.role}</p>
              </div>
            </div>
            <p className="text-base text-gray-700">{leader.quote}</p>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Milestones</p>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Threads through time</h2>
        </div>
        <div className="relative space-y-8 rounded-[32px] border border-stone-100 bg-white p-8 shadow-sm">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-amber-400 to-amber-700 sm:left-10" />
          <div className="space-y-10">
            {timeline.map((entry, index) => (
              <div key={entry.year} className="relative flex flex-col gap-2 pl-16 sm:flex-row sm:items-center sm:gap-8 sm:pl-20">
                <div className="absolute left-5 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-amber-600 sm:left-9" />
                <div className="w-28 flex-shrink-0 text-sm font-semibold text-amber-700">{entry.year}</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{entry.title}</p>
                  <p className="mt-2 text-sm text-gray-600">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-[32px] bg-stone-900 p-10 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Visit the studio</p>
            <h3 className="text-3xl font-semibold sm:text-4xl">
              Book a private appointment in Charsadda or schedule a virtual styling call.
            </h3>
            <p className="text-base text-stone-200">
              We curate shawls based on your palette, degree of warmth, and preferred drapes. Every visit ends
              with chai, conversation, and custom tassels if you wish.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-base font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              Plan a visit
            </Link>
            <Link
              href="https://wa.me/9230187868666?text=Salaam%20Khyber%20Shawls%20team"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/50 px-8 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              WhatsApp us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
