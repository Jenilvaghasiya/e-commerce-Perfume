import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, type OrderResponse } from '../services/api';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    customNotes?: {
      top: string;
      middle: string;
      base: string;
    };
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const list = await getMyOrders();
        const mapped: Order[] = list.map((o: OrderResponse) => ({
          id: (o as any)._id,
          orderNumber: o.orderNumber,
          date: o.createdAt?.split('T')[0] || new Date(o.createdAt).toISOString().split('T')[0],
          status: o.status as Order['status'],
          total: o.total,
          items: o.items.map((it) => ({
            id: (it as any).productId || '',
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            image: (it as any).image || '',
            customNotes: it.customNotes as any,
          })),
          shippingAddress: o.shippingAddress,
          paymentMethod: o.paymentMethod,
          trackingNumber: o.trackingNumber,
        }));
        if (mounted) setOrders(mapped);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user, reloadKey]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate a printable invoice and trigger browser's Save as PDF
  const handleDownloadInvoice = (order: Order) => {
    try {
      const win = window.open('', '_blank');
      if (!win) return;

      const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
      const tax = order.total * 0.08;
      const grandTotal = order.total + tax;
      const orderDate = new Date(order.date).toLocaleDateString();

      const itemsRows = order.items
        .map(
          (it) => `
            <tr>
              <td style="padding:8px;border:1px solid #e5e7eb">${it.name}</td>
              <td style="padding:8px;border:1px solid #e5e7eb;text-align:center">${it.quantity}</td>
              <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${formatCurrency(it.price)}</td>
              <td style="padding:8px;border:1px solid #e5e7eb;text-align:right">${formatCurrency(it.price * it.quantity)}</td>
            </tr>`
        )
        .join('');

      const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice ${order.orderNumber} - Ignite Perfumes</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; margin: 0; }
      .container { max-width: 800px; margin: 24px auto; padding: 0 16px; }
      .header { display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 16px; }
      .brand { font-size: 24px; font-weight: 800; color: #7c3aed; }
      .meta { text-align:right; font-size:14px; color:#6b7280; }
      .section { margin-top: 16px; }
      .section h3 { margin: 0 0 8px 0; font-size: 16px; }
      table { width:100%; border-collapse: collapse; margin-top: 8px; font-size: 14px; }
      th { text-align:left; background:#f9fafb; border:1px solid #e5e7eb; padding:8px; }
      td { padding:8px; border:1px solid #e5e7eb; }
      .totals { width: 320px; margin-left:auto; font-size:14px; }
      .totals .row { display:flex; justify-content:space-between; padding:6px 0; }
      .totals .grand { border-top:1px solid #e5e7eb; margin-top:6px; padding-top:8px; font-weight:700; }
      .footer { margin-top:24px; text-align:center; font-size:12px; color:#6b7280; }
      @media print { .no-print { display:none; } }
      .btn { display:inline-block; margin-top:12px; background:#7c3aed; color:#fff; padding:10px 14px; border-radius:8px; text-decoration:none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="brand">Ignite Perfumes</div>
        <div class="meta">
          <div>Invoice #: ${order.orderNumber}</div>
          <div>Date: ${orderDate}</div>
          <div>Status: ${order.status}</div>
        </div>
      </div>

      <div class="section" style="display:flex; gap:16px;">
        <div style="flex:1">
          <h3>Bill To</h3>
          <div style="background:#f9fafb; padding:12px; border-radius:8px;">
            <div style="font-weight:600">${order.shippingAddress.name}</div>
            <div>${order.shippingAddress.address}</div>
            <div>${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</div>
            <div>${order.shippingAddress.phone}</div>
          </div>
        </div>
        <div style="flex:1">
          <h3>Payment</h3>
          <div style="background:#f9fafb; padding:12px; border-radius:8px;">
            <div>Method: <strong>${order.paymentMethod}</strong></div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Unit Price</th>
              <th style="text-align:right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <div class="section totals">
        <div class="row"><span>Subtotal</span><span>${formatCurrency(order.total)}</span></div>
        <div class="row"><span>Shipping</span><span>Free</span></div>
        <div class="row"><span>Tax (8%)</span><span>${formatCurrency(tax)}</span></div>
        <div class="row grand"><span>Total</span><span>${formatCurrency(grandTotal)}</span></div>
      </div>

      <div class="footer">
        Thank you for shopping with Ignite Perfumes.
      </div>

      <div class="no-print" style="text-align:center">
        <a href="#" class="btn" onclick="window.print(); return false;">Print / Save as PDF</a>
      </div>
    </div>
  </body>
</html>`;

      win.document.open();
      win.document.write(html);
      win.document.close();
      // Give the new window a moment to render, then trigger print
      setTimeout(() => {
        win.focus();
        win.print();
      }, 300);
    } catch (err) {
      console.error('Failed to generate invoice', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-xl text-gray-600">Track and manage your perfume orders</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a
              href="/shop"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Order {order.orderNumber}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Placed on {new Date(order.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 4} more items
                      </div>
                    )}
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                          <p className="text-sm text-blue-700">{order.trackingNumber}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details - {selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          {item.customNotes && (
                            <div className="text-xs text-purple-600 mt-1">
                              <p>Custom Notes: Top: {item.customNotes.top}, Middle: {item.customNotes.middle}, Base: {item.customNotes.base}</p>
                            </div>
                          )}
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{(selectedOrder.total * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${(selectedOrder.total * 1.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <button onClick={() => handleDownloadInvoice(selectedOrder)} className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                    <Download className="w-5 h-5" />
                    <span>Download Invoice</span>
                  </button>
                  {selectedOrder.trackingNumber && (
                    <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      <Truck className="w-5 h-5" />
                      <span>Track Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;