"use client";

import Image from "next/image";
import { products, formatPrice, type Product } from "@/lib/data";

type ProductsProps = {
  onSelectProduct: (productName: string) => void;
};

export default function Products({ onSelectProduct }: ProductsProps) {
  return (
    <section id="products" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="text-xs text-damber-blue font-medium tracking-widest mb-2">
            MAHSULOTLARIMIZ
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-damber-navy mb-3">
            Ota-onangiz uchun mos modelni tanlang
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Premium massaj kreslolari 3 yil kafolat bilan
          </p>
        </div>

        {/* Product cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={() => onSelectProduct(product.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onOrder,
}: {
  product: Product;
  onOrder: () => void;
}) {
  return (
    <div className="product-card border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Image area */}
      <div
        className={`relative aspect-[4/5] ${product.bgColor} overflow-hidden`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-medium">
            {product.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-[10px] text-gray-500 tracking-widest mb-1">
          {product.series}
        </div>
        <h3 className="font-display text-xl font-semibold text-damber-navy mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-damber-navy"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1D9E75"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Narxi:</div>
          <div className="text-xl font-semibold text-damber-navy">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onOrder}
          className="w-full mt-4 bg-damber-blue hover:bg-damber-blue-dark text-white py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
}
