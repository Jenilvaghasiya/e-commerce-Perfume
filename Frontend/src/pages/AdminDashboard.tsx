import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { getAdminStats, getAllUsers, type AdminUser, type AdminStatsResponse, getAllCustomizationsAdmin, type CustomizationResponse } from '../services/api';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { getAllOrders, updateOrderStatus, refreshAllOrders } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'Unisex',
    inStock: true,
    featured: false
  });

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse>({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [customizations, setCustomizations] = useState<CustomizationResponse[]>([]);
  const [selectedCustomization, setSelectedCustomization] = useState<CustomizationResponse | null>(null);
  const orders = getAllOrders();

  useEffect(() => {
    if (!isAdmin) return; // redirect below will handle
    (async () => {
      try {
        await refreshAllOrders();
        const [s, u, c] = await Promise.all([getAdminStats(), getAllUsers(), getAllCustomizationsAdmin()]);
        setStats(s);
        setUsers(u);
        setCustomizations(c);
      } catch (e) {
        console.error('Failed to load admin data', e);
      }
    })();
  }, [isAdmin, refreshAllOrders]);

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    setProductForm({
      name: '',
      price: 0,
      description: '',
      image: '',
      category: 'Unisex',
      inStock: true,
      featured: false
    });
    setShowAddProduct(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowAddProduct(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const computedStats = {
    totalProducts: stats.totalProducts || products.length,
    totalOrders: stats.totalOrders || orders.length,
    totalUsers: stats.totalUsers || users.length,
    totalRevenue: stats.totalRevenue || orders.reduce((sum, order) => sum + order.total, 0)
  };

  const ordersByUserId: Record<string, number> = orders.reduce((acc, o) => {
    const uid = (o as any).userId || '';
    if (!uid) return acc;
    acc[uid] = (acc[uid] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'customizations', name: 'Customize Orders', icon: Package },
              { id: 'users', name: 'Users', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${computedStats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">{order.email }</td>
                        <td className="py-3 px-4">${order.total}</td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6">Order ID</th>
                    <th className="text-left py-3 px-6">Customer</th>
                    <th className="text-left py-3 px-6">Email</th>
                    <th className="text-left py-3 px-6">Total</th>
                    <th className="text-left py-3 px-6">Status</th>
                    <th className="text-left py-3 px-6">Date</th>
                    <th className="text-left py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">#{order.id}</td>
                      <td className="py-4 px-6">{order.email}</td>
                      <td className="py-4 px-6">${order.total}</td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">{order.date}</td>
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customize Orders (Customizations) */}
        {activeTab === 'customizations' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Customize Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6">ID</th>
                    <th className="text-left py-3 px-6">Name</th>
                    <th className="text-left py-3 px-6">Bottle Size (ml)</th>
                    <th className="text-left py-3 px-6">Concentration (%)</th>
                    <th className="text-left py-3 px-6">Total Price</th>
                    <th className="text-left py-3 px-6">Date</th>
                    <th className="text-left py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customizations.map(c => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">#{c._id}</td>
                      <td className="py-4 px-6">{c.name}</td>
                      <td className="py-4 px-6">{c.bottleSize}</td>
                      <td className="py-4 px-6">{c.concentration}</td>
                      <td className="py-4 px-6">${c.totalPrice}</td>
                      <td className="py-4 px-6">{(c.createdAt || '').toString().split('T')[0]}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedCustomization(c)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customization Detail Modal */}
        {selectedCustomization && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
                <h3 className="text-2xl font-bold">Customization Details</h3>
                <p className="opacity-90">ID: #{selectedCustomization._id}</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="text-gray-900 font-semibold">
                      {users.find(u => u._id === (selectedCustomization as any).userId)?.name || 'Unknown User'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="text-gray-900 font-semibold">{selectedCustomization.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bottle Size</p>
                    <p className="text-gray-900 font-semibold">{selectedCustomization.bottleSize} ml</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Concentration</p>
                    <p className="text-gray-900 font-semibold">{selectedCustomization.concentration}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-gray-900 font-semibold">${selectedCustomization.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-semibold">{(selectedCustomization.createdAt || '').toString().split('T')[0]}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Notes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Top Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomization.notes.top.length ? (
                          selectedCustomization.notes.top.map((n, idx) => (
                            <span key={`top-${idx}`} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {n.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Middle Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomization.notes.middle.length ? (
                          selectedCustomization.notes.middle.map((n, idx) => (
                            <span key={`mid-${idx}`} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {n.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Base Notes</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomization.notes.base.length ? (
                          selectedCustomization.notes.base.map((n, idx) => (
                            <span key={`base-${idx}`} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {n.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedCustomization(null)}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6">Name</th>
                    <th className="text-left py-3 px-6">Email</th>
                    <th className="text-left py-3 px-6">Role</th>
                    <th className="text-left py-3 px-6">Join Date</th>
                    <th className="text-left py-3 px-6">Orders</th>
                    <th className="text-left py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{u.name}</td>
                      <td className="py-4 px-6">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">{(u.createdAt || '').toString().split('T')[0]}</td>
                      <td className="py-4 px-6">{ordersByUserId[u._id] || 0}</td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  placeholder="Product name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  placeholder="Product description"
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                
                <input
                  type="url"
                  name="image"
                  value={productForm.image}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={productForm.inStock}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">In Stock</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={productForm.featured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Featured</span>
                  </label>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        price: 0,
                        description: '',
                        image: '',
                        category: 'Unisex',
                        inStock: true,
                        featured: false
                      });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;