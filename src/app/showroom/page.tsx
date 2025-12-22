"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "binh-hoa", name: "Bình hoa" },
  { id: "tach-ly", name: "Tách & Ly" },
  { id: "chau-cay", name: "Chậu cây" },
  { id: "dia-bat", name: "Đĩa & Bát" },
  { id: "trang-tri", name: "Trang trí" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export default function ShowroomPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-[family-name:var(--font-caveat)] text-2xl text-[var(--color-terracotta)] mb-4">
            Bộ sưu tập
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium text-[var(--color-charcoal)] mb-6">
            Showroom
          </h1>
          <p className="text-xl text-[var(--color-charcoal)]/70 max-w-2xl mx-auto">
            Khám phá những tác phẩm gốm thủ công, mỗi sản phẩm là một câu chuyện
            riêng
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 border-b border-[var(--color-sand)]">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm transition-colors ${
                activeCategory === category.id
                  ? "bg-[var(--color-terracotta)] text-[var(--color-cream)]"
                  : "bg-[var(--color-sand)]/50 text-[var(--color-charcoal)] hover:bg-[var(--color-terracotta)] hover:text-[var(--color-cream)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-[var(--color-charcoal)]/50">
              Đang tải sản phẩm...
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-[var(--color-cream)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-[var(--color-sand)]/50 flex items-center justify-center relative overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[var(--color-charcoal)]/30">
                        Ảnh sản phẩm
                      </span>
                    )}
                    <div className="absolute inset-0 bg-[var(--color-charcoal)]/0 group-hover:bg-[var(--color-charcoal)]/10 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[var(--color-charcoal)] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[var(--color-charcoal)]/60 text-sm mb-3">
                      {product.description}
                    </p>
                    <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-terracotta)]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <p className="text-center text-[var(--color-charcoal)]/50">
              Không có sản phẩm nào trong danh mục này
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[var(--color-sand)]/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-sage)] mb-2">
            Đặt hàng
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[var(--color-charcoal)] mb-6">
            Bạn thích sản phẩm nào?
          </h2>
          <p className="text-[var(--color-charcoal)]/70 mb-8">
            Liên hệ với chúng tôi để đặt hàng hoặc tìm hiểu thêm về sản phẩm.
            Chúng tôi cũng nhận đặt hàng theo yêu cầu riêng.
          </p>
          <Link
            href="/contact"
            className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-8 py-4 rounded-full font-medium transition-colors inline-block"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </>
  );
}
