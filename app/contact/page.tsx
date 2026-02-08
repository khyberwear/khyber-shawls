// // // export const runtime = 'edge';
import Link from "next/link"
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react"

import { prisma } from "@/lib/prisma"

const studioHours = [
  { day: "Monday – Thursday", slots: ["10:00am – 6:00pm"] },
  { day: "Friday – Saturday", slots: ["11:00am – 8:00pm"] },
  { day: "Sunday", slots: ["By appointment only"] },
]

export default async function ContactPage() {
  const settings = await prisma.settings.findFirst().catch(() => null)

  const contactInfo = {
    phone: settings?.contactPhone || "+92 301 878 6666",
    email: settings?.contactEmail || "hello@khybershawls.store",
    address:
      settings?.contactAddress ||
      "Office #27, Durrani Market\nCharsadda, Khyber Pakhtunkhwa\nPakistan",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13103.043079784556!2d71.725!3d34.145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d917d8b4592cfd%3A0x66e0bbec31d9551c!2sCharsadda%2C%20Khyber%20Pakhtunkhwa!5e0!3m2!1sen!2s!4v1731699999999",
  }

  const whatsappHref = "https://wa.me/9230187868666?text=Salaam%20Khyber%20Shawls%20team"

  return (
    <div className="space-y-12 pb-16">
      {/* Quick-actions bar */}
      <section className="grid gap-4 rounded-[32px] border border-amber-100 bg-amber-50/80 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
          className="flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white/90"
        >
          <Phone className="h-5 w-5 text-amber-600" />
          Call us
        </Link>
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-500/90 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp us
        </Link>
        <Link
          href={`mailto:${contactInfo.email}`}
          className="flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white/90"
        >
          <Mail className="h-5 w-5 text-amber-600" />
          Email us
        </Link>
        <Link
          href="https://share.google/QAs5GynOUkFZpUhqQ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white/90"
        >
          <MapPin className="h-5 w-5 text-amber-600" />
          Locate us
        </Link>
      </section>

      {/* Contact cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-amber-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Call</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-gray-900">{contactInfo.phone}</p>
          <p className="text-sm text-gray-500">Studio concierge</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-amber-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Email</p>
          </div>
          <p className="mt-3 text-xl font-semibold text-gray-900">{contactInfo.email}</p>
          <p className="text-sm text-gray-500">Custom orders & partnerships</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-amber-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Visit</p>
          </div>
          <p className="mt-3 whitespace-pre-line text-xl font-semibold text-gray-900">
            {contactInfo.address}
          </p>
        </div>
      </section>

      {/* Hours */}
      <section className="rounded-[32px] border border-stone-100 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Studio hours</p>
          <h2 className="text-3xl font-semibold text-gray-900">We weave, steam, and style daily.</h2>
          <div className="space-y-4">
            {studioHours.map((slot) => (
              <div key={slot.day} className="rounded-2xl border border-amber-50 bg-amber-50/40 p-4">
                <p className="text-sm font-semibold text-stone-900">{slot.day}</p>
                {slot.slots.map((time) => (
                  <p key={time} className="text-sm text-gray-600">
                    {time}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="space-y-4 rounded-[32px] border border-stone-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Find us in Charsadda</p>
          <p className="text-base text-gray-600">
            Our studio is nestled inside Durrani Market—minutes from the historic Shabqadar Fort road.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
          <p className="text-sm text-gray-700">
            Map preview unavailable in this browser. Use the link below to open directions on Google Maps.
          </p>
          <Link
            href="https://share.google/QAs5GynOUkFZpUhqQ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-400"
          >
            Open map
          </Link>
        </div>
      </section>
    </div>
  )
}

