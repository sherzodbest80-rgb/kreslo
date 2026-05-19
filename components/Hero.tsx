export default function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center animate-stagger">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-damber-accent text-damber-blue px-4 py-1.5 rounded-full text-xs font-medium mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Duo — xotirjamlik kaliti
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-damber-navy leading-tight mb-4 max-w-3xl mx-auto">
            Ota-onalarini
            <br />
            qadrlovchilar uchun
          </h1>

          {/* Subtitle */}
          <p className="text-base text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Sizni yoshligingizda qiynalib katta qilgan ota-onangizni ushbu
            mahsulot bilan xursand qiling va duolarini oling.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a
              href="#contact"
              className="bg-damber-blue hover:bg-damber-blue-dark text-white px-7 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 group"
            >
              Bepul konsultatsiya olish
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
            <a
              href="#products"
              className="bg-white text-damber-navy px-7 py-3 rounded-lg text-sm font-medium border border-gray-200 hover:border-damber-blue hover:text-damber-blue transition-colors"
            >
              Mahsulotlarni ko&apos;rish
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-8 border-t border-gray-100 max-w-3xl mx-auto">
            <TrustItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              }
              title="Bepul yetkazib berish"
              subtitle="O'zbekiston bo'ylab"
            />
            <TrustItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              }
              title="3 yil kafolat"
              subtitle="Rasmiy kafolat"
            />
            <TrustItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
                </svg>
              }
              title="24/7 qo'llab-quvvatlash"
              subtitle="Har doim yoningizda"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-damber-blue flex-shrink-0">{icon}</div>
      <div className="text-left">
        <div className="text-sm font-medium text-damber-navy">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}
