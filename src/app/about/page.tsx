import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Câu chuyện Peppory - nơi nghệ thuật gốm gặp gỡ triết lý wabi-sabi.",
};

const philosophy = [
  {
    number: "1",
    title: "Không hoàn hảo",
    description: "Mỗi vết nứt, vân men đều là dấu ấn độc nhất",
    color: "terracotta",
  },
  {
    number: "2",
    title: "Đơn giản",
    description: "Loại bỏ những thứ không cần thiết",
    color: "sage",
  },
  {
    number: "3",
    title: "Tự nhiên",
    description: "Tôn trọng nguyên liệu và quy trình tự nhiên",
    color: "terracotta",
  },
];

const process = [
  { title: "Chuẩn bị đất", description: "Chọn lọc và nhào đất sét" },
  { title: "Tạo hình", description: "Chuốt tay trên bàn xoay" },
  { title: "Tráng men", description: "Men tự pha, màu tự nhiên" },
  { title: "Nung", description: "1200°C trong 12 giờ" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-[family-name:var(--font-caveat)] text-2xl text-[var(--color-terracotta)] mb-4">
            Về chúng tôi
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium text-[var(--color-charcoal)] mb-6">
            Câu chuyện Peppory
          </h1>
          <p className="text-xl text-[var(--color-charcoal)]/70 max-w-2xl mx-auto">
            Nơi nghệ thuật gốm gặp gỡ triết lý wabi-sabi
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-[var(--color-sand)] rounded-2xl flex items-center justify-center order-2 md:order-1">
            <span className="text-[var(--color-charcoal)]/30">Ảnh founder</span>
          </div>
          <div className="order-1 md:order-2">
            <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-sage)] mb-2">
              Khởi nguồn
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[var(--color-charcoal)] mb-6">
              Từ đam mê đến tác phẩm
            </h2>
            <p className="text-[var(--color-charcoal)]/70 text-lg mb-6 leading-relaxed">
              Peppory được thành lập vào năm 2020, bắt đầu từ một xưởng nhỏ với
              niềm đam mê dành cho gốm thủ công. Chúng tôi tin rằng mỗi sản phẩm
              nên kể một câu chuyện riêng.
            </p>
            <p className="text-[var(--color-charcoal)]/70 text-lg leading-relaxed">
              Tên &ldquo;Peppory&rdquo; kết hợp giữa &ldquo;pepper&rdquo; (tiêu)
              - biểu tượng của sự đậm đà, cá tính - và &ldquo;pottery&rdquo;
              (gốm), thể hiện sự hòa quyện giữa truyền thống và cá tính riêng.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 bg-[var(--color-sand)]/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-terracotta)] mb-2">
            Triết lý
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[var(--color-charcoal)] mb-8">
            Wabi-sabi
          </h2>
          <p className="text-xl text-[var(--color-charcoal)]/70 mb-12 leading-relaxed">
            Wabi-sabi là triết lý thẩm mỹ Nhật Bản tôn vinh vẻ đẹp của sự không
            hoàn hảo, tạm thời, và chưa hoàn thiện. Tại Peppory, chúng tôi áp
            dụng triết lý này vào từng sản phẩm.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.map((item) => (
              <div
                key={item.number}
                className="bg-[var(--color-cream)] p-8 rounded-2xl"
              >
                <div
                  className={`w-16 h-16 ${
                    item.color === "sage"
                      ? "bg-[var(--color-sage)]/30"
                      : "bg-[var(--color-terracotta)]/20"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span
                    className={`font-[family-name:var(--font-caveat)] text-2xl ${
                      item.color === "sage"
                        ? "text-[var(--color-sage)]"
                        : "text-[var(--color-terracotta)]"
                    }`}
                  >
                    {item.number}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[var(--color-charcoal)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--color-charcoal)]/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-[family-name:var(--font-caveat)] text-xl text-[var(--color-sage)] mb-2">
              Quy trình
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[var(--color-charcoal)]">
              Từ đất đến tác phẩm
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square bg-[var(--color-sand)] rounded-2xl mb-4 flex items-center justify-center">
                  <span className="text-[var(--color-charcoal)]/30 text-sm">
                    Ảnh {step.title.toLowerCase()}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[var(--color-charcoal)] mb-1">
                  {step.title}
                </h3>
                <p className="text-[var(--color-charcoal)]/60 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
