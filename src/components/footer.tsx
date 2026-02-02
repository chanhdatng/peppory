import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/showroom", label: "Showroom" },
  { href: "/contact", label: "Liên hệ" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-charcoal)] text-[var(--color-cream)] py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4">
            Peppory
          </h3>
          <p className="text-[var(--color-cream)]/70 max-w-md">
            Tiệm gốm thủ công với phong cách wabi-sabi, tôn vinh vẻ đẹp của sự
            không hoàn hảo.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liên kết</h4>
          <ul className="space-y-2 text-[var(--color-cream)]/70">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[var(--color-terracotta)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liên hệ</h4>
          <ul className="space-y-2 text-[var(--color-cream)]/70">
            <li>nhannho86@gmail.com</li>
            <li>0705944351</li>
            <li>32A Nguyễn Bá Huân, Thảo Điền, HCM</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[var(--color-cream)]/10 text-center">
        <p className="text-[var(--color-cream)]/50 text-sm">
          © {new Date().getFullYear()} Peppory. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
