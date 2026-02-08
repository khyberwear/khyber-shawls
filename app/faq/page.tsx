// // // // export const runtime = 'edge';
import Link from "next/link"

export const metadata = {
  title: "Frequently Asked Questions | Khyber Shawls",
  description: "Find answers to common questions about Khyber Shawls products, shipping, returns, care instructions, and more.",
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Products & Quality",
      questions: [
        {
          q: "Are all your shawls handcrafted?",
          a: "Yes, every shawl at Khyber Shawls is 100% handcrafted by skilled artisans. Each piece is unique and may have slight natural variations that add to its authenticity and charm."
        },
        {
          q: "What materials are used in your shawls?",
          a: "We use premium quality materials including pure Pashmina, silk, wool, and blended fabrics. Each product listing specifies the exact material composition."
        },
        {
          q: "How can I verify the authenticity of my shawl?",
          a: "All our shawls come with a certificate of authenticity. You can also perform the ring test for Pashmina shawls - a genuine Pashmina shawl should pass through a wedding ring due to its fine weave."
        },
        {
          q: "Do you offer custom or personalized shawls?",
          a: "Yes! We accept custom orders for specific colors, patterns, or sizes. Please contact us at custom@khybershawls.com with your requirements for a quote and timeline."
        },
        {
          q: "What's the difference between Pashmina and regular wool?",
          a: "Pashmina comes from the undercoat of Himalayan mountain goats and is much finer (12-16 microns) than regular wool. It's softer, warmer, lighter, and more luxurious."
        }
      ]
    },
    {
      category: "Ordering & Payment",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards (Visa, Mastercard), bank transfers, JazzCash, Easypaisa, and cash on delivery (COD) for orders within Pakistan."
        },
        {
          q: "Is cash on delivery available?",
          a: "Yes, COD is available for orders within Pakistan. A small COD fee of Rs 100 applies. Orders above Rs 10,000 may require advance payment."
        },
        {
          q: "Can I modify or cancel my order?",
          a: "You can modify or cancel your order within 2 hours of placement. After that, orders enter processing and cannot be changed. Contact us immediately at orders@khybershawls.com."
        },
        {
          q: "Do you offer gift wrapping?",
          a: "Yes! We offer complimentary elegant gift wrapping for all orders. Just select the gift wrap option at checkout or mention it in order notes."
        },
        {
          q: "Can I order in bulk or wholesale?",
          a: "Absolutely! We offer special pricing for bulk orders (10+ pieces) and wholesale inquiries. Contact wholesale@khybershawls.com for details."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "Within major cities (Karachi, Lahore, Islamabad): 2-4 business days. Other cities: 4-7 business days. International orders: 10-15 business days depending on destination."
        },
        {
          q: "What are the shipping charges?",
          a: "Shipping within Pakistan is Rs 200. FREE shipping on orders over Rs 5,000. International shipping costs vary by destination and weight."
        },
        {
          q: "Do you ship internationally?",
          a: "Yes, we ship worldwide! International shipping times and costs vary by location. Customs duties and taxes are the buyer's responsibility."
        },
        {
          q: "How can I track my order?",
          a: "Once shipped, you'll receive a tracking number via email and SMS. You can track your order on our website at /track-order or through the courier's website."
        },
        {
          q: "What if my package is lost or damaged during shipping?",
          a: "All orders are insured. If your package is lost or arrives damaged, contact us within 48 hours with photos. We'll arrange a replacement or full refund immediately."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy. Items must be unused, unwashed, with original tags attached. Return shipping is free for defective items; customer pays return shipping for other reasons."
        },
        {
          q: "How do I initiate a return?",
          a: "Email returns@khybershawls.com with your order number and reason for return. We'll provide return instructions and a return authorization number within 24 hours."
        },
        {
          q: "Can I exchange my shawl for a different color or size?",
          a: "Yes! Exchanges are free within 30 days. Contact us and we'll arrange to send the new item while you return the original."
        },
        {
          q: "How long does it take to receive my refund?",
          a: "Once we receive your return, refunds are processed within 7-10 business days to your original payment method. You'll receive email confirmation."
        },
        {
          q: "Are custom or personalized items returnable?",
          a: "Custom-made items can only be returned if defective or damaged. Since they're made to your specifications, we cannot accept returns for change of mind."
        }
      ]
    },
    {
      category: "Care & Maintenance",
      questions: [
        {
          q: "How should I wash my Pashmina shawl?",
          a: "Hand wash in cold water with mild baby shampoo or wool detergent. Do NOT wring or twist. Gently squeeze excess water and lay flat to dry away from direct sunlight. Dry cleaning is recommended for best results."
        },
        {
          q: "Can I machine wash my shawl?",
          a: "We strongly recommend against machine washing. The delicate fibers can be damaged. If absolutely necessary, use a delicate cycle in a mesh bag with cold water, but hand washing is always preferred."
        },
        {
          q: "How do I remove wrinkles from my shawl?",
          a: "Use a steamer on low heat or iron on the lowest setting with a cloth between the iron and shawl. Never iron directly. Hanging in a steamy bathroom also works."
        },
        {
          q: "How should I store my shawls?",
          a: "Store in a breathable cotton bag or wrapped in acid-free tissue paper in a cool, dry place. Add cedar balls or lavender sachets to prevent moths. Never use plastic bags."
        },
        {
          q: "What if my shawl develops pilling?",
          a: "Light pilling is natural with use. Gently remove pills with a cashmere comb or fabric shaver. Do not pull or pick at pills as this can damage the weave."
        }
      ]
    },
    {
      category: "Contact & Support",
      questions: [
        {
          q: "How can I contact customer support?",
          a: "Email: info@khybershawls.com | Phone: +92 300 1234567 | WhatsApp: +92 300 1234567. Our support hours are Monday-Saturday, 9 AM - 6 PM PKT."
        },
        {
          q: "Do you have a physical store?",
          a: "Currently we operate online only, but you can schedule an appointment to view our collection in person at our Peshawar location. Contact us 48 hours in advance."
        },
        {
          q: "How do I stay updated on new arrivals and sales?",
          a: "Subscribe to our newsletter at the bottom of any page, follow us on Instagram and Facebook, or check our website's new arrivals section regularly."
        },
        {
          q: "Do you offer gift certificates?",
          a: "Yes! Gift certificates are available in denominations from Rs 2,000 to Rs 50,000. Contact us at gifts@khybershawls.com to purchase."
        },
        {
          q: "I have a question not listed here. What should I do?",
          a: "We're here to help! Contact us via email, phone, or WhatsApp, or use the contact form on our website. We typically respond within 24 hours."
        }
      ]
    }
  ]

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          â† Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about our products, orders, and services
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {faqs.map((section) => (
            <a
              key={section.category}
              href={`#${section.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-amber-700 hover:text-amber-900 hover:underline"
            >
              {section.category}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {faqs.map((section) => (
          <section
            key={section.category}
            id={section.category.toLowerCase().replace(/\s+/g, '-')}
            className="scroll-mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-amber-600">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.questions.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
        <p className="text-gray-700 mb-6">
          Can't find what you're looking for? Our customer support team is here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
          >
            Contact Us
          </Link>
          <a
            href="mailto:info@khybershawls.com"
            className="inline-block bg-white text-amber-700 border-2 border-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
          >
            Email Support
          </a>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/policies/shipping" className="text-amber-700 hover:text-amber-900 hover:underline">
            Shipping Policy
          </Link>
          <Link href="/policies/returns" className="text-amber-700 hover:text-amber-900 hover:underline">
            Returns & Refunds
          </Link>
          <Link href="/policies/privacy" className="text-amber-700 hover:text-amber-900 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/policies/terms" className="text-amber-700 hover:text-amber-900 hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </main>
  )
}


