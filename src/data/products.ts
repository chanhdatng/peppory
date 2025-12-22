export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export const products: Product[] = [
  {
    id: "binh-hoa-wabi",
    name: "Bình hoa Wabi",
    description: "Gốm thủ công, men đất nung tự nhiên. Cao 25cm.",
    price: 850000,
    category: "binh-hoa",
  },
  {
    id: "bo-tach-tra-sabi",
    name: "Bộ tách trà Sabi",
    description: "4 tách + 1 ấm, men xanh rêu mộc mạc.",
    price: 1200000,
    category: "tach-ly",
  },
  {
    id: "chau-cay-mini",
    name: "Chậu cây mini",
    description: "Gốm mộc, lỗ thoát nước. Phù hợp sen đá.",
    price: 280000,
    category: "chau-cay",
  },
  {
    id: "dia-trang-tri-organic",
    name: "Đĩa trang trí Organic",
    description: "Đường kính 30cm, men trắng ngà tự nhiên.",
    price: 650000,
    category: "dia-bat",
  },
  {
    id: "ly-uong-nuoc-tho-moc",
    name: "Ly uống nước thô mộc",
    description: "Dung tích 300ml, cầm tay êm.",
    price: 180000,
    category: "tach-ly",
  },
  {
    id: "binh-nho-don-sac",
    name: "Bình nhỏ đơn sắc",
    description: "Cao 15cm, phù hợp hoa khô, cành nhỏ.",
    price: 420000,
    category: "binh-hoa",
  },
];

export const categories = [
  { id: "all", name: "Tất cả" },
  { id: "binh-hoa", name: "Bình hoa" },
  { id: "tach-ly", name: "Tách & Ly" },
  { id: "chau-cay", name: "Chậu cây" },
  { id: "dia-bat", name: "Đĩa & Bát" },
  { id: "trang-tri", name: "Trang trí" },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}
