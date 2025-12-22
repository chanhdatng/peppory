import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, type Product } from "@/lib/supabase";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let featuredProducts: Product[] = [];

  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    // Fallback to empty array if Supabase not configured
    console.error("Failed to fetch products:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-[family-name:var(--font-caveat)] text-2xl text-[var(--color-terracotta)] mb-4">
            Thủ công từ tâm
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-medium text-[var(--color-charcoal)] mb-6 leading-tight">
            Gốm Peppory
          </h1>
          <p className="text-xl text-[var(--color-charcoal)]/70 max-w-2xl mx-auto mb-10">
            Mỗi tác phẩm là một câu chuyện, được tạo ra với sự tỉ mỉ và tình yêu
            dành cho nghệ thuật gốm thủ công
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/showroom"
              className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-8 py-4 rounded-full font-medium transition-colors"
            >
              Khám phá Showroom
            </Link>
            <Link
              href="/about"
              className="border-2 border-[var(--color-charcoal)]/20 hover:border-[var(--color-terracotta)] text-[var(--color-charcoal)] px-8 py-4 rounded-full font-medium transition-colors"
            >
              Về Peppory
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 bg-[var(--color-sand)]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-sage)] mb-2">
              Bộ sưu tập
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[var(--color-charcoal)]">
              Sản phẩm nổi bật
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="group bg-[var(--color-cream)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-[var(--color-sand)]/50 flex items-center justify-center relative">
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
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[var(--color-charcoal)] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[var(--color-charcoal)]/60 text-sm">
                      {product.description}
                    </p>
                    <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-terracotta)] mt-3">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholders
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group bg-[var(--color-cream)] rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="aspect-square bg-[var(--color-sand)]/50 flex items-center justify-center">
                    <span className="text-[var(--color-charcoal)]/30">
                      Ảnh sản phẩm
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-[var(--color-sand)]/50 rounded mb-2" />
                    <div className="h-4 bg-[var(--color-sand)]/30 rounded w-3/4" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 text-[var(--color-terracotta)] font-medium hover:gap-3 transition-all"
            >
              Xem tất cả sản phẩm
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-[var(--color-sand)] rounded-2xl flex items-center justify-center">
            <span className="text-[var(--color-charcoal)]/30">
              Ảnh xưởng gốm
            </span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-sage)] mb-2">
              Câu chuyện
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[var(--color-charcoal)] mb-6">
              Wabi-sabi trong từng nét vẽ
            </h2>
            <p className="text-[var(--color-charcoal)]/70 text-lg mb-6 leading-relaxed">
              Peppory ra đời từ tình yêu với sự không hoàn hảo. Chúng tôi tin
              rằng vẻ đẹp nằm ở những vết nứt, những đường cong không đều, và
              màu men tự nhiên không thể lặp lại.
            </p>
            <p className="text-[var(--color-charcoal)]/70 text-lg mb-8 leading-relaxed">
              Mỗi sản phẩm được tạo ra bằng tay, với sự tôn trọng dành cho
              nguyên liệu và quy trình truyền thống.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[var(--color-terracotta)] font-medium hover:gap-3 transition-all"
            >
              Đọc thêm về chúng tôi
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
