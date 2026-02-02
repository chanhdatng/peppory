"use client";

import { useState, useEffect, useRef } from "react";
import type { Order, OrderItem, Product } from "@/lib/supabase";

const orderStatuses = [
  { id: "pending", name: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
  { id: "processing", name: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  { id: "completed", name: "Hoàn thành", color: "bg-green-100 text-green-800" },
  { id: "cancelled", name: "Đã hủy", color: "bg-red-100 text-red-800" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState<Order | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    items: [] as OrderItem[],
    shipping_fee: 0,
    notes: "",
    status: "pending" as Order["status"],
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    }
    setLoading(false);
  }

  async function fetchProducts() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      setProducts(await res.json());
    }
  }

  function resetForm() {
    setFormData({
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      items: [],
      shipping_fee: 0,
      notes: "",
      status: "pending",
    });
    setEditingOrder(null);
    setShowForm(false);
    setSelectedProduct("");
    setSelectedQuantity(1);
  }

  function handleEdit(order: Order) {
    setEditingOrder(order);
    setFormData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || "",
      items: order.items || [],
      shipping_fee: order.shipping_fee || 0,
      notes: order.notes || "",
      status: order.status,
    });
    setShowForm(true);
  }

  function addItem() {
    if (!selectedProduct) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = formData.items.findIndex((i) => i.product_id === selectedProduct);
    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += selectedQuantity;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            product_id: product.id,
            product_name: product.name,
            quantity: selectedQuantity,
            price: product.price,
          },
        ],
      });
    }
    setSelectedProduct("");
    setSelectedQuantity(1);
  }

  function removeItem(index: number) {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  }

  function calculateSubtotal() {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function calculateTotal() {
    return calculateSubtotal() + formData.shipping_fee;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }

    const method = editingOrder ? "PUT" : "POST";
    const body = editingOrder
      ? { id: editingOrder.id, ...formData, total: calculateTotal() }
      : { ...formData, total: calculateTotal() };

    const res = await fetch("/api/admin/orders", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      fetchOrders();
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchOrders();
  }

  async function handleStatusChange(id: string, status: Order["status"]) {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) fetchOrders();
  }

  function handlePrintInvoice() {
    if (invoiceRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Hóa đơn - Peppory</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .invoice { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #c4704f; margin-bottom: 5px; }
                .info { margin-bottom: 20px; }
                .info p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #f5f5f5; }
                .text-right { text-align: right; }
                .total-row { font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; color: #666; }
                @media print { body { padding: 0; } }
              </style>
            </head>
            <body>
              ${invoiceRef.current.innerHTML}
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getOrderSubtotal(order: Order) {
    return order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-[var(--color-charcoal)]">
          Quản lý đơn hàng
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-6 py-2 rounded-full font-medium transition-colors"
        >
          + Tạo đơn hàng
        </button>
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[var(--color-cream)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-charcoal)] mb-6">
              {editingOrder ? "Sửa đơn hàng" : "Tạo đơn hàng mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                />
              </div>

              {/* Add Product */}
              <div className="border-t border-[var(--color-sand)] pt-4">
                <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                  Thêm sản phẩm
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {formatPrice(p.price)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-20 px-3 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none text-center"
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-3 bg-[var(--color-sage)] text-white rounded-xl hover:bg-[var(--color-sage)]/80 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-white rounded-xl p-4 space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--color-sand)] last:border-0">
                      <div>
                        <span className="font-medium">{item.product_name}</span>
                        <span className="text-[var(--color-charcoal)]/60 ml-2">x{item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[var(--color-terracotta)]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 text-[var(--color-charcoal)]/70">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                </div>
              )}

              {/* Shipping Fee */}
              <div>
                <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                  Phí vận chuyển
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.shipping_fee}
                  onChange={(e) => setFormData({ ...formData, shipping_fee: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  placeholder="0"
                />
              </div>

              {/* Total */}
              {formData.items.length > 0 && (
                <div className="bg-[var(--color-terracotta)]/10 rounded-xl p-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-[var(--color-terracotta)]">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none resize-none"
                />
              </div>

              {editingOrder && (
                <div>
                  <label className="text-[var(--color-charcoal)]/70 text-sm block mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Order["status"] })}
                    className="w-full px-4 py-3 bg-white border border-[var(--color-sand)] rounded-xl focus:border-[var(--color-terracotta)] focus:outline-none"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-[var(--color-cream)] px-6 py-3 rounded-full font-medium transition-colors"
                >
                  {editingOrder ? "Cập nhật" : "Tạo đơn"}
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

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-charcoal)]">
                Hóa đơn
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-[var(--color-terracotta)] text-white rounded-full text-sm hover:bg-[var(--color-terracotta-dark)] transition-colors"
                >
                  In hóa đơn
                </button>
                <button
                  onClick={() => setShowInvoice(null)}
                  className="px-4 py-2 border border-[var(--color-charcoal)]/20 rounded-full text-sm hover:border-[var(--color-terracotta)] transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div ref={invoiceRef} className="invoice">
              <div className="header">
                <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#c4704f" }}>PEPPORY</h1>
                <p style={{ color: "#666" }}>Gốm thủ công Việt Nam</p>
              </div>

              <div style={{ borderTop: "2px solid #c4704f", margin: "20px 0" }}></div>

              <div className="info" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <p><strong>Khách hàng:</strong> {showInvoice.customer_name}</p>
                  <p><strong>SĐT:</strong> {showInvoice.customer_phone}</p>
                  {showInvoice.customer_address && (
                    <p><strong>Địa chỉ:</strong> {showInvoice.customer_address}</p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p><strong>Mã đơn:</strong> #{showInvoice.id.slice(0, 8).toUpperCase()}</p>
                  <p><strong>Ngày:</strong> {formatDate(showInvoice.created_at)}</p>
                  <p><strong>Trạng thái:</strong> {orderStatuses.find(s => s.id === showInvoice.status)?.name}</p>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Sản phẩm</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>SL</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Đơn giá</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {showInvoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.product_name}</td>
                      <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>{formatPrice(item.price)}</td>
                      <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Tạm tính:</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>{formatPrice(getOrderSubtotal(showInvoice))}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>Phí vận chuyển:</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>{formatPrice(showInvoice.shipping_fee || 0)}</td>
                  </tr>
                  <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                    <td colSpan={3} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right" }}>TỔNG CỘNG:</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "right", color: "#c4704f" }}>{formatPrice(showInvoice.total)}</td>
                  </tr>
                </tfoot>
              </table>

              {showInvoice.notes && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                  <p><strong>Ghi chú:</strong> {showInvoice.notes}</p>
                </div>
              )}

              <div className="footer" style={{ marginTop: "40px", textAlign: "center", color: "#666" }}>
                <p>Cảm ơn quý khách đã mua hàng tại Peppory!</p>
                <p style={{ fontSize: "12px" }}>Hotline: 0123 456 789 | Email: hello@peppory.vn</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <p className="text-center text-[var(--color-charcoal)]/50">Đang tải...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-sand)]/30">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Khách hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Sản phẩm</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Tổng tiền</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Ngày tạo</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[var(--color-charcoal)]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[var(--color-sand)]">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[var(--color-charcoal)]">{order.customer_name}</p>
                      <p className="text-sm text-[var(--color-charcoal)]/60">{order.customer_phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-charcoal)]/70">
                    {order.items?.map((item) => `${item.product_name} x${item.quantity}`).join(", ") || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <p className="text-[var(--color-terracotta)] font-medium">{formatPrice(order.total)}</p>
                      {(order.shipping_fee || 0) > 0 && (
                        <p className="text-xs text-[var(--color-charcoal)]/50">Ship: {formatPrice(order.shipping_fee)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        orderStatuses.find((s) => s.id === order.status)?.color
                      }`}
                    >
                      {orderStatuses.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-charcoal)]/70">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShowInvoice(order)}
                      className="text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] mr-3"
                      title="Xem hóa đơn"
                    >
                      Hóa đơn
                    </button>
                    <button onClick={() => handleEdit(order)} className="text-[var(--color-sage)] hover:text-[var(--color-terracotta)] mr-3">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:text-red-700">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-8 text-[var(--color-charcoal)]/50">Chưa có đơn hàng nào</p>
          )}
        </div>
      )}
    </>
  );
}
