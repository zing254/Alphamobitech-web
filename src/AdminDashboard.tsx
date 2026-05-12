import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Wrench, Calendar, 
  TrendingUp, TrendingDown, DollarSign, Phone,
  Clock, CheckCircle, XCircle, Settings,
  LogOut, Search, Eye, Trash2,
  Edit, Plus, BarChart3, Activity, Loader,
  Globe, Image, Star, Save, X, ChevronDown, ChevronUp
} from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import {
  getServices, saveServices,
  getGallery, saveGallery,
  getSocialLinks, saveSocialLinks,
  getHeroSlides, saveHeroSlides,
  getFeatures, saveFeatures,
  AVAILABLE_ICONS, SERVICE_CATEGORIES,
  type Service, type GalleryItem, type SocialLinks,
  type HeroSlide, type Feature
} from './data/content';

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  device: string;
  service: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  amount: number;
  notes?: string;
}

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  payment: string;
}

const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'alphamobitech767@gmail.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'jimmy@99'
};

const SESSION_DURATION = 24 * 60 * 60 * 1000;
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000;

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'AMB001', customerName: 'Sarah Johnson', phone: '0703555449', device: 'iPhone 14', service: 'Screen Replacement', status: 'completed', date: '2026-04-21', amount: 3500 },
    { id: 'AMB002', customerName: 'David Kamau', phone: '0712345678', device: 'Samsung S23', service: 'Battery Replacement', status: 'in-progress', date: '2026-04-21', amount: 2000 },
    { id: 'AMB003', customerName: 'Emily Rodriguez', phone: '0723456789', device: 'OnePlus 11', service: 'Screen Replacement', status: 'pending', date: '2026-04-20', amount: 2800 },
    { id: 'AMB004', customerName: 'Michael Ochieng', phone: '0734567890', device: 'Google Pixel 8', service: 'Back Glass', status: 'pending', date: '2026-04-20', amount: 2500 },
    { id: 'AMB005', customerName: 'Faith Nekesa', phone: '0745678901', device: 'iPhone 13', service: 'Charging Port', status: 'completed', date: '2026-04-19', amount: 2000 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD001', customer: 'John Doe', email: 'john@email.com', phone: '0700000001', items: [{ name: 'iPhone 15 Pro Max', qty: 1, price: 185000 }], total: 185000, status: 'pending', date: '2026-04-24', payment: 'mpesa' },
    { id: 'ORD002', customer: 'Jane Smith', email: 'jane@email.com', phone: '0700000002', items: [{ name: 'MacBook Air M3', qty: 1, price: 165000 }], total: 165000, status: 'confirmed', date: '2026-04-23', payment: 'cash' },
    { id: 'ORD003', customer: 'Bob Wilson', email: 'bob@email.com', phone: '0700000003', items: [{ name: 'iPad Pro 12.9"', qty: 2, price: 155000 }], total: 310000, status: 'shipped', date: '2026-04-22', payment: 'mpesa' },
  ]);
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    
    if (auth === 'true') {
      if (authTime) {
        const elapsed = Date.now() - parseInt(authTime);
        if (elapsed > SESSION_DURATION) {
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminAuthTime');
          setIsAuthenticated(false);
          return;
        }
      }
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!ADMIN_CREDENTIALS.email || !ADMIN_CREDENTIALS.password) {
      setLoginError('Admin credentials not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env');
      return false;
    }
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      localStorage.setItem('adminSessionExpiry', (Date.now() + duration).toString());
      setIsAuthenticated(true);
      setLoginError('');
      return true;
    } else {
      setLoginError('Invalid email or password');
      return false;
    }
  };

  const handleResetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Password reset link sent to ${email}\n\nDemo: In production, check your email for the reset link.`);
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    localStorage.removeItem('adminSessionExpiry');
    setIsAuthenticated(false);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    if (confirm(`Are you sure you want to delete booking ${id}?`)) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const stats: StatCard[] = [
    { title: 'Total Bookings', value: bookings.length, change: Math.round(((bookings.length - Math.max(3, bookings.length - 2)) / Math.max(3, bookings.length - 2)) * 100), icon: <Calendar className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Completed', value: bookings.filter(b => b.status === 'completed').length, change: 8, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'In Progress', value: bookings.filter(b => b.status === 'in-progress').length, change: bookings.filter(b => b.status === 'in-progress').length - 3, icon: <Activity className="w-6 h-6" />, color: 'bg-amber-500' },
    { title: 'Revenue (KSh)', value: (bookings.reduce((sum, b) => sum + b.amount, 0) + orders.reduce((sum, o) => sum + o.total, 0)).toLocaleString(), change: 15, icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-500' },
  ];

  const services = [
    { name: 'Screen Replacement', count: 45, revenue: 157500 },
    { name: 'Battery Replacement', count: 32, revenue: 64000 },
    { name: 'Charging Port', count: 18, revenue: 36000 },
    { name: 'Back Glass', count: 15, revenue: 37500 },
    { name: 'Water Damage', count: 10, revenue: 35000 },
    { name: 'Camera Repair', count: 7, revenue: 17500 },
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.phone.includes(orderSearch)
  );

  const Sidebar = () => (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 relative">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-amber-500">Alphamobitech</h1>
        <p className="text-xs text-slate-400">Admin Portal</p>
      </div>
      
      <nav className="space-y-2">
        {[
          { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
          { id: 'orders', icon: <Calendar className="w-5 h-5" />, label: 'Orders' },
          { id: 'bookings', icon: <Calendar className="w-5 h-5" />, label: 'Repair Bookings' },
          { id: 'customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
          { id: 'services', icon: <Wrench className="w-5 h-5" />, label: 'Services' },
          { id: 'content', icon: <Globe className="w-5 h-5" />, label: 'Content' },
          { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
          { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === item.id 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-lg cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <div className="text-white">{stat.icon}</div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
          <div className="text-sm text-slate-500">{stat.title}</div>
        </div>
      ))}
    </div>
  );

  const BookingsTable = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Bookings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none">
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-amber-600">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{booking.customerName}</div>
                  <div className="text-sm text-slate-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{booking.device}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{booking.service}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                    booking.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                    {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                    {booking.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">KSh {booking.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingBooking(booking)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingBooking({...booking})} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteBooking(booking.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ServicesChart = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Services Breakdown</h2>
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{service.name}</span>
                <span className="text-sm text-slate-500">{service.count} repairs</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${(service.count / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Revenue by Service</h2>
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">{service.name}</div>
                  <div className="text-sm text-slate-500">{service.count} repairs</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-800">KSh {service.revenue.toLocaleString()}</div>
                <div className="text-sm text-green-600">+{Math.round((service.revenue / 350000) * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Plus className="w-5 h-5" />, label: 'New Booking', color: 'bg-amber-500' },
          { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', color: 'bg-blue-500' },
          { icon: <Phone className="w-5 h-5" />, label: 'Call Customer', color: 'bg-green-500' },
          { icon: <BarChart3 className="w-5 h-5" />, label: 'Generate Report', color: 'bg-purple-500' },
        ].map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <StatsGrid />
      <BookingsTable />
      <ServicesChart />
      <QuickActions />
    </div>
  );

  const BookingsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Bookings Management</h1>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>New Booking</span>
        </button>
      </div>
      <BookingsTable />
    </div>
  );

  const OrdersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Store Orders</h1>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <input type="text" placeholder="Search orders..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="px-4 py-2 border rounded-lg w-full max-w-md" />
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-amber-600">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{order.customer}</div>
                  <div className="text-sm text-slate-500">{order.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name} x{item.qty}</div>
                  ))}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">KSh {order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])} className="text-sm border rounded px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ServicesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Services Management</h1>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-amber-600" />
              </div>
              <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{service.name}</h3>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{service.count} repairs</span>
              <span className="font-semibold text-amber-600">KSh {service.revenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Monthly Revenue</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 45, 78, 52, 88, 70, 95, 60, 85, 72, 90, 80].map((h, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-around mt-4 text-xs text-slate-500">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Services Distribution</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="35 65" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-35" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#92400e" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-60" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">127</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Screen Replacement', color: 'bg-amber-500' },
              { label: 'Battery', color: 'bg-amber-700' },
              { label: 'Charging Port', color: 'bg-amber-900' },
              { label: 'Other', color: 'bg-slate-300' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsContent = () => {
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordUpdated, setPasswordUpdated] = useState(false);

    const handleSaveProfile = () => {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    };

    const handleUpdatePassword = () => {
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
    };

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" defaultValue="alphamobitech767@gmail.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input type="tel" defaultValue="0703555449" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <button onClick={handleSaveProfile} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                  {profileSaved ? 'Saved!' : 'Save Changes'}
                </button>
                {profileSaved && <p className="text-green-600 text-sm">Profile saved successfully!</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <button onClick={handleUpdatePassword} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                  {passwordUpdated ? 'Updated!' : 'Update Password'}
                </button>
                {passwordUpdated && <p className="text-green-600 text-sm">Password updated successfully!</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                  <input type="text" defaultValue="Alphamobitech" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input type="text" defaultValue="Nairobi CBD, Kenya" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Working Hours</label>
                  <input type="text" defaultValue="Mon-Sat: 8AM - 6PM" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Notifications</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-700">Email notifications for new bookings</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-700">WhatsApp notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-700">Daily reports</span>
                  <input type="checkbox" className="w-5 h-5 text-amber-500 rounded cursor-pointer" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomersContent = () => {
    const customers = [
      { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '0703555449', totalBookings: 5, spent: 12500 },
      { id: 2, name: 'David Kamau', email: 'david@email.com', phone: '0712345678', totalBookings: 3, spent: 8500 },
      { id: 3, name: 'Emily Rodriguez', email: 'emily@email.com', phone: '0723456789', totalBookings: 2, spent: 5500 },
      { id: 4, name: 'Michael Ochieng', email: 'michael@email.com', phone: '0734567890', totalBookings: 1, spent: 3500 },
      { id: 5, name: 'Faith Nekesa', email: 'faith@email.com', phone: '0745678901', totalBookings: 4, spent: 15000 },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-800">{customer.name}</div>
                      <div className="text-sm text-slate-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.totalBookings}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-amber-600">KSh {customer.spent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Phone className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ContentEditor = () => {
    const [activeContentTab, setActiveContentTab] = useState('services');

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Content Editor</h1>
        <div className="flex gap-2 flex-wrap border-b pb-4">
          {[
            { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" /> },
            { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
            { id: 'social', label: 'Social Links', icon: <Globe className="w-4 h-4" /> },
            { id: 'hero', label: 'Hero Slides', icon: <Star className="w-4 h-4" /> },
            { id: 'features', label: 'Features', icon: <LayoutDashboard className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveContentTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                activeContentTab === tab.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {activeContentTab === 'services' && <ServicesEditor />}
        {activeContentTab === 'gallery' && <GalleryEditor />}
        {activeContentTab === 'social' && <SocialLinksEditor />}
        {activeContentTab === 'hero' && <HeroEditor />}
        {activeContentTab === 'features' && <FeaturesEditor />}
      </div>
    );
  };

  const ServicesEditor = () => {
    const [items, setItems] = useState<Service[]>(() => getServices());
    const [editing, setEditing] = useState<Service | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Partial<Service>>({ name: '', description: '', price: 0, category: 'iPhone', iconName: 'Smartphone', duration: '1 hour', popular: false });

    const handleSave = () => {
      if (editing) {
        setItems(items.map(i => i.id === editing.id ? { ...i, ...form } as Service : i));
      } else {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        setItems([...items, { ...form, id: newId } as Service]);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: 0, category: 'iPhone', iconName: 'Smartphone', duration: '1 hour', popular: false });
    };

    const handlePersist = () => {
      saveServices(items);
      alert('Services saved! Refresh the front-end to see changes.');
    };

    const handleDelete = (id: number) => {
      if (confirm('Delete this service?')) setItems(items.filter(i => i.id !== id));
    };

    const startEdit = (item: Service) => {
      setEditing(item);
      setForm({ ...item });
      setShowForm(true);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">{items.length} services</p>
          <div className="flex gap-2">
            {items !== getServices() && (
              <button onClick={() => { setItems(getServices()); setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer">Reset</button>
            )}
            <button onClick={handlePersist} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save All</button>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', price: 0, category: 'iPhone', iconName: 'Smartphone', duration: '1 hour', popular: false }); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Add Service</button>
          </div>
        </div>
        {showForm && (
          <div className="bg-white rounded-xl p-4 border space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-slate-700">Name</label><input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="text-sm font-medium text-slate-700">Price (KSh)</label><input type="number" value={form.price || 0} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="text-sm font-medium text-slate-700">Category</label><select value={form.category || 'iPhone'} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">{SERVICE_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-sm font-medium text-slate-700">Duration</label><input value={form.duration || ''} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="text-sm font-medium text-slate-700">Icon</label><select value={form.iconName || 'Smartphone'} onChange={e => setForm({...form, iconName: e.target.value})} className="w-full px-3 py-2 border rounded-lg">{AVAILABLE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}</select></div>
              <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.popular || false} onChange={e => setForm({...form, popular: e.target.checked})} className="w-5 h-5" /><label className="text-sm font-medium text-slate-700">Popular</label></div>
            </div>
            <div><label className="text-sm font-medium text-slate-700">Description</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer">{editing ? 'Update' : 'Add'}</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 cursor-pointer">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{item.category}</span>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{item.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-amber-600">KSh {item.price.toLocaleString()}</span>
                <span className="text-slate-400">{item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GalleryEditor = () => {
    const [items, setItems] = useState<GalleryItem[]>(() => getGallery());
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [form, setForm] = useState<Partial<GalleryItem>>({ title: '', description: '', image: '', category: 'Screen' });

    const handleSave = () => {
      if (editing) {
        setItems(items.map(i => i.id === editing.id ? { ...i, ...form } as GalleryItem : i));
      } else {
        setItems([...items, { ...form, id: Math.max(...items.map(i => i.id), 0) + 1 } as GalleryItem]);
      }
      setShowForm(false); setEditing(null);
      setForm({ title: '', description: '', image: '', category: 'Screen' });
    };

    const handleDelete = (id: number) => {
      if (confirm('Delete this item?')) setItems(items.filter(i => i.id !== id));
    };

    const handlePersist = () => {
      saveGallery(items);
      alert('Gallery saved!');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">{items.length} items</p>
          <div className="flex gap-2">
            <button onClick={handlePersist} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save All</button>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', image: '', category: 'Screen' }); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Add</button>
          </div>
        </div>
        {showForm && (
          <div className="bg-white rounded-xl p-4 border space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-slate-700">Title</label><input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="text-sm font-medium text-slate-700">Category</label><input value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div><label className="text-sm font-medium text-slate-700">Description</label><input value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="text-sm font-medium text-slate-700">Image URL</label><input value={form.image || ''} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="/images/example.jpeg" /></div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer">{editing ? 'Update' : 'Add'}</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 cursor-pointer">Cancel</button>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">{item.title}</div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(item); setForm({ ...item }); setShowForm(true); }} className="p-1.5 text-slate-400 hover:text-amber-600 rounded cursor-pointer"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SocialLinksEditor = () => {
    const [links, setLinks] = useState<SocialLinks>(() => getSocialLinks());

    const handleSave = () => {
      saveSocialLinks(links);
      alert('Social links saved!');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Edit your social media URLs</p>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save</button>
        </div>
        <div className="bg-white rounded-xl p-4 border space-y-3 max-w-lg">
          {(['facebook', 'instagram', 'twitter', 'whatsapp'] as const).map(platform => (
            <div key={platform}>
              <label className="text-sm font-medium text-slate-700 capitalize">{platform} URL</label>
              <input value={links[platform]} onChange={e => setLinks({...links, [platform]: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HeroEditor = () => {
    const [slides, setSlides] = useState<HeroSlide[]>(() => getHeroSlides());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    const handleSave = () => {
      saveHeroSlides(slides);
      alert('Hero slides saved!');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">{slides.length} slides</p>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save</button>
        </div>
        {slides.map((slide, i) => (
          <div key={i} className="bg-white rounded-xl border">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between p-4 cursor-pointer">
              <span className="font-semibold text-slate-800">Slide {i + 1}: {slide.title}</span>
              {expanded === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-slate-700">Title</label><input value={slide.title} onChange={e => { const s = [...slides]; s[i] = {...s[i], title: e.target.value}; setSlides(s); }} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-sm font-medium text-slate-700">Subtitle</label><input value={slide.subtitle} onChange={e => { const s = [...slides]; s[i] = {...s[i], subtitle: e.target.value}; setSlides(s); }} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="text-sm font-medium text-slate-700">Description</label><textarea value={slide.description} onChange={e => { const s = [...slides]; s[i] = {...s[i], description: e.target.value}; setSlides(s); }} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-slate-700">CTA Text</label><input value={slide.cta} onChange={e => { const s = [...slides]; s[i] = {...s[i], cta: e.target.value}; setSlides(s); }} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-sm font-medium text-slate-700">Image</label><input value={slide.image} onChange={e => { const s = [...slides]; s[i] = {...s[i], image: e.target.value}; setSlides(s); }} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const FeaturesEditor = () => {
    const [items, setItems] = useState<Feature[]>(() => getFeatures());
    const [editing, setEditing] = useState<number | null>(null);
    const [form, setForm] = useState<Partial<Feature>>({ iconName: 'Zap', title: '', description: '' });

    const handleSave = () => {
      saveFeatures(items);
      alert('Features saved!');
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">{items.length} features</p>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" /> Save</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border p-4">
              {editing === i ? (
                <div className="space-y-2">
                  <div><label className="text-xs font-medium text-slate-700">Icon</label><select value={form.iconName || 'Zap'} onChange={e => setForm({...form, iconName: e.target.value})} className="w-full px-3 py-2 border rounded-lg">{AVAILABLE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}</select></div>
                  <div><label className="text-xs font-medium text-slate-700">Title</label><input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-xs font-medium text-slate-700">Description</label><input value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div className="flex gap-2">
                    <button onClick={() => { const s = [...items]; s[i] = {...s[i], ...form} as Feature; setItems(s); setEditing(null); }} className="px-3 py-1.5 bg-amber-500 text-white rounded text-sm cursor-pointer">Save</button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-slate-200 rounded text-sm cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <button onClick={() => { setEditing(i); setForm({ ...item }); }} className="p-1.5 text-slate-400 hover:text-amber-600 rounded cursor-pointer"><Edit className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'orders': return <OrdersContent />;
      case 'bookings': return <BookingsContent />;
      case 'customers': return <CustomersContent />;
      case 'services': return <ServicesContent />;
      case 'content': return <ContentEditor />;
      case 'analytics': return <AnalyticsContent />;
      case 'settings': return <SettingsContent />;
      default: return <DashboardContent />;
    }
  };

  const BookingModal = () => {
    if (!viewingBooking) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingBooking(null)}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Booking Details</h3>
            <button onClick={() => setViewingBooking(null)} className="p-2 hover:bg-slate-100 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div><span className="text-sm text-slate-500">ID:</span> <span className="font-medium">{viewingBooking.id}</span></div>
            <div><span className="text-sm text-slate-500">Customer:</span> <span className="font-medium">{viewingBooking.customerName}</span></div>
            <div><span className="text-sm text-slate-500">Phone:</span> <span className="font-medium">{viewingBooking.phone}</span></div>
            <div><span className="text-sm text-slate-500">Device:</span> <span className="font-medium">{viewingBooking.device}</span></div>
            <div><span className="text-sm text-slate-500">Service:</span> <span className="font-medium">{viewingBooking.service}</span></div>
            <div><span className="text-sm text-slate-500">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              viewingBooking.status === 'completed' ? 'bg-green-100 text-green-700' :
              viewingBooking.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
              viewingBooking.status === 'pending' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>{viewingBooking.status}</span></div>
            <div><span className="text-sm text-slate-500">Date:</span> <span className="font-medium">{viewingBooking.date}</span></div>
            <div><span className="text-sm text-slate-500">Amount:</span> <span className="font-bold text-amber-600">KSh {viewingBooking.amount.toLocaleString()}</span></div>
            {viewingBooking.notes && <div><span className="text-sm text-slate-500">Notes:</span> <p className="text-sm mt-1">{viewingBooking.notes}</p></div>}
          </div>
        </div>
      </div>
    );
  };

interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSave: (updated: Booking) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, onClose, onSave }) => {
  const [editForm, setEditForm] = useState(booking);

  const handleSave = () => {
    onSave(editForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Edit Booking</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value as Booking['status']})} className="w-full px-3 py-2 border rounded-lg">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (KSh)</label>
            <input type="number" value={editForm.amount} onChange={(e) => setEditForm({...editForm, amount: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea value={editForm.notes || ''} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Save</button>
            <button onClick={onClose} className="flex-1 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={(email, password, rememberMe) => handleLogin(email, password, rememberMe)} onResetPassword={handleResetPassword} error={loginError} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </header>
        {renderContent()}
      </main>
      <BookingModal />
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(updated) => {
            setBookings(bookings.map(b => b.id === updated.id ? updated : b));
            setEditingBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;