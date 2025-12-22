"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

const categories = [
  { id: "binh-hoa", name: "Bình hoa" },
  { id: "tach-ly", name: "Tách & Ly" },
  { id: "chau-cay", name: "Chậu cây" },
  { id: "dia-bat", name: "Đĩa & Bát" },
  { id: "trang-tri", name: "Trang trí" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "binh-hoa",
    image_url: "",
    is_featured: false,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFormData({ ...formData, image_url: url });
      } else {
        alert("Upload thất bại");
      }
    } catch {
      alert("Upload thất bại");
    }
    setUploading(false);
  }

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchProducts();
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setError("Sai mật khẩu");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setProducts([]);
  }

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "binh-hoa",
      image_url: "",
      is_featured: false,
    });
    setEditingProduct(null);
    setShowForm(false);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "binh-hoa",
      image_url: product.image_url || "",
      is_featured: product.is_featured,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingProduct ? "PUT" : "POST";
    const body = editingProduct
      ? { id: editingProduct.id, ...formData }
      : formData;

    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      fetchProducts();
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchProducts();
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-md w-full bg-[var(--color-sand)]/30 p-8 rounded-2xl">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-charcoal)] mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-cream)] border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                placeholder="Nhập mật khẩu admin"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-6 py-3 rounded-full font-medium transition-colors"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[var(--color-charcoal)]">
            Quản lý sản phẩm
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-6 py-2 rounded-full font-medium transition-colors"
            >
              + Thêm sản phẩm
            </button>
            <button
              onClick={handleLogout}
              className="border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] px-6 py-2 rounded-full font-medium hover:border-[var(--color-terracotta)] transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-[var(--color-cream)] rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-charcoal)] mb-6">
                {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                      Giá (VNĐ) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                      Danh mục
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Hình ảnh
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-[var(--color-sand)]/50">
                        <Image
                          src={formData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {/* Upload Button */}
                    <label className="block">
                      <span className="inline-block px-4 py-2 bg-[var(--color-sage)] hover:bg-[var(--color-sage)]/80 text-white rounded-full cursor-pointer text-sm transition-colors">
                        {uploading ? "Đang tải..." : "Chọn ảnh từ máy"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {/* Or URL input */}
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-charcoal)]/50 text-sm">hoặc</span>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Nhập URL ảnh"
                        className="flex-1 px-3 py-2 text-sm bg-white border border-[var(--color-sand)] rounded-lg focus:border-[var(--color-terracotta)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_featured" className="text-[var(--color-charcoal)]/70">
                    Sản phẩm nổi bật (hiển thị trang chủ)
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-6 py-3 rounded-full font-medium transition-colors"
                  >
                    {editingProduct ? "Cập nhật" : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] px-6 py-3 rounded-full font-medium hover:border-[var(--color-terracotta)] transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <p className="text-center text-[var(--color-charcoal)]/50">Đang tải...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--color-sand)]/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">
                    Sản phẩm
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">
                    Danh mục
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">
                    Giá
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">
                    Nổi bật
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[var(--color-sand)]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--color-charcoal)]">
                          {product.name}
                        </p>
                        <p className="text-sm text-[var(--color-charcoal)]/60">
                          {product.description?.slice(0, 50)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-charcoal)]/70">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </td>
                    <td className="px-6 py-4 text-right text-[var(--color-terracotta)] font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.is_featured ? "⭐" : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[var(--color-sage)] hover:text-[var(--color-terracotta)] mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center py-8 text-[var(--color-charcoal)]/50">
                Chưa có sản phẩm nào
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
