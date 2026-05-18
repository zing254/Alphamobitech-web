import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Wrench, Calendar, 
  TrendingUp, TrendingDown, DollarSign, Phone,
  Clock, CheckCircle, XCircle, Settings,
  LogOut, Search, Eye, Trash2,
  Edit, Plus, BarChart3, Activity, Loader,
  ShoppingCart, Image, Edit2
} from 'lucide-react';
import AdminLogin from './components/AdminLogin';

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
  email: import.meta.env.VITE_ADMIN_EMAIL || '',
  password: import.meta.env.VITE_ADMIN_PASSWORD || ''
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
    <aside className="w-64 bg-slate-800 border-r border-slate-700/50 text-white min-h-screen p-4 relative">
       <div className="mb-8 text-center border-b pb-4">
         <div className="flex items-center justify-center gap-3 mb-4">
           <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
             <LayoutDashboard className="w-6 h-6 text-white" />
           </div>
           <div>
             <h1 className="text-2xl font-bold text-amber-100">Alphamobitech</h1>
             <p className="text-xs text-amber-300">Admin Portal</p>
           </div>
         </div>
         <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-4"></div>
       </div>
      
        <nav className="space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
            { id: 'orders', icon: <Calendar className="w-5 h-5" />, label: 'Orders' },
            { id: 'bookings', icon: <Calendar className="w-5 h-5" />, label: 'Repair Bookings' },
            { id: 'customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
            { id: 'services', icon: <Wrench className="w-5 h-5" />, label: 'Services' },
            { id: 'products', icon: <ShoppingCart className="w-5 h-5" />, label: 'Products' },
            { id: 'gallery', icon: <Image className="w-5 h-5" />, label: 'Gallery' },
            { id: 'content', icon: <Edit2 className="w-5 h-5" />, label: 'Content' },
            { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
            { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-amber-200 hover:bg-amber-900/50 hover:text-white'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white hover:bg-slate-700 transition-colors rounded-lg cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <div className="text-white">{stat.icon}</div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(stat.change)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-slate-400">{stat.title}</div>
        </div>
      ))}
    </div>
  );

  const BookingsTable = () => (
    <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none">
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
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-amber-400">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{booking.customerName}</div>
                  <div className="text-sm text-slate-400">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{booking.device}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{booking.service}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                    booking.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
                    booking.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {booking.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                    {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                    {booking.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-white">KSh {booking.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewingBooking(booking)} className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingBooking({...booking})} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteBooking(booking.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
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
      <div className="bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Services Breakdown</h2>
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">{service.name}</span>
                <span className="text-sm text-slate-400">{service.count} repairs</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${(service.count / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Revenue by Service</h2>
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{service.name}</div>
                  <div className="text-sm text-slate-400">{service.count} repairs</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">KSh {service.revenue.toLocaleString()}</div>
                <div className="text-sm text-green-400">+{Math.round((service.revenue / 350000) * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Plus className="w-5 h-5" />, label: 'New Booking', color: 'bg-amber-500' },
          { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', color: 'bg-blue-500' },
          { icon: <Phone className="w-5 h-5" />, label: 'Call Customer', color: 'bg-green-500' },
          { icon: <BarChart3 className="w-5 h-5" />, label: 'Generate Report', color: 'bg-purple-500' },
        ].map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-700/50 hover:border-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-slate-200">{action.label}</span>
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
        <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
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
        <h1 className="text-2xl font-bold text-white">Store Orders</h1>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>
      <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-700/30">
          <input type="text" placeholder="Search orders..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="px-4 py-2 bg-slate-700 border-slate-600 rounded-lg w-full max-w-md" />
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-amber-400">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{order.customer}</div>
                  <div className="text-sm text-slate-400">{order.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name} x{item.qty}</div>
                  ))}
                </td>
                <td className="px-6 py-4 font-bold text-white">KSh {order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])} className="text-sm bg-slate-700 border-slate-600 rounded px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="p-1 text-amber-400 hover:bg-amber-500/10 rounded">
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
        <h1 className="text-2xl font-bold text-white">Services Management</h1>
        <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div key={i} className="bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-amber-400" />
              </div>
              <button className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-white mb-2">{service.name}</h3>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{service.count} repairs</span>
              <span className="font-semibold text-amber-400">KSh {service.revenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Monthly Revenue</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[65, 45, 78, 52, 88, 70, 95, 60, 85, 72, 90, 80].map((h, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-around mt-4 text-xs text-slate-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Services Distribution</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#334155" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="35 65" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-35" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#92400e" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-60" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">127</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Screen Replacement', color: 'bg-amber-500' },
              { label: 'Battery', color: 'bg-amber-700' },
              { label: 'Charging Port', color: 'bg-amber-900' },
              { label: 'Other', color: 'bg-slate-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-sm text-slate-300">{item.label}</span>
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
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                  <input type="email" defaultValue="admin@alphamobitech.com" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Phone</label>
                  <input type="tel" defaultValue="0703555449" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <button onClick={handleSaveProfile} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                  {profileSaved ? 'Saved!' : 'Save Changes'}
                </button>
                {profileSaved && <p className="text-green-400 text-sm">Profile saved successfully!</p>}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Current Password</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">New Password</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Confirm New Password</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <button onClick={handleUpdatePassword} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                  {passwordUpdated ? 'Updated!' : 'Update Password'}
                </button>
                {passwordUpdated && <p className="text-green-400 text-sm">Password updated successfully!</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Business Name</label>
                  <input type="text" defaultValue="Alphamobitech" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Address</label>
                  <input type="text" defaultValue="Nairobi CBD, Kenya" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Working Hours</label>
                  <input type="text" defaultValue="Mon-Sat: 8AM - 6PM" className="w-full px-4 py-2 bg-slate-700 border-slate-600 rounded-lg focus:border-amber-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Notifications</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-200">Email notifications for new bookings</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-200">WhatsApp notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-200">Daily reports</span>
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
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{customer.name}</div>
                      <div className="text-sm text-slate-400">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{customer.totalBookings}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-amber-400">KSh {customer.spent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"><Phone className="w-4 h-4" /></button>
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

   const renderContent = () => {
     switch (activeTab) {
       case 'dashboard': return <DashboardContent />;
       case 'orders': return <OrdersContent />;
       case 'bookings': return <BookingsContent />;
       case 'customers': return <CustomersContent />;
       case 'services': return <ServicesContent />;
       case 'products': return <ProductsContent />;
       case 'gallery': return <GalleryContent />;
       case 'content': return <ContentManagementContent />;
       case 'analytics': return <AnalyticsContent />;
       case 'settings': return <SettingsContent />;
       default: return <DashboardContent />;
     }
   };

  const BookingModal = () => {
    if (!viewingBooking) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingBooking(null)}>
        <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Booking Details</h3>
            <button onClick={() => setViewingBooking(null)} className="p-2 hover:bg-slate-700 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div><span className="text-sm text-slate-400">ID:</span> <span className="font-medium">{viewingBooking.id}</span></div>
            <div><span className="text-sm text-slate-400">Customer:</span> <span className="font-medium">{viewingBooking.customerName}</span></div>
            <div><span className="text-sm text-slate-400">Phone:</span> <span className="font-medium">{viewingBooking.phone}</span></div>
            <div><span className="text-sm text-slate-400">Device:</span> <span className="font-medium">{viewingBooking.device}</span></div>
            <div><span className="text-sm text-slate-400">Service:</span> <span className="font-medium">{viewingBooking.service}</span></div>
            <div><span className="text-sm text-slate-400">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              viewingBooking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
              viewingBooking.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
              viewingBooking.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
              'bg-red-500/10 text-red-400'
            }`}>{viewingBooking.status}</span></div>
            <div><span className="text-sm text-slate-400">Date:</span> <span className="font-medium">{viewingBooking.date}</span></div>
            <div><span className="text-sm text-slate-400">Amount:</span> <span className="font-bold text-amber-400">KSh {viewingBooking.amount.toLocaleString()}</span></div>
            {viewingBooking.notes && <div><span className="text-sm text-slate-400">Notes:</span> <p className="text-sm mt-1">{viewingBooking.notes}</p></div>}
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
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Booking</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Status</label>
            <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value as Booking['status']})} className="w-full px-3 py-2 bg-slate-700 border-slate-600 rounded-lg">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Amount (KSh)</label>
            <input type="number" value={editForm.amount} onChange={(e) => setEditForm({...editForm, amount: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 bg-slate-700 border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Notes</label>
            <textarea value={editForm.notes || ''} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border-slate-600 rounded-lg" rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Save</button>
            <button onClick={onClose} className="flex-1 py-2 bg-slate-600 rounded-lg hover:bg-slate-500">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={(email, password, rememberMe) => handleLogin(email, password, rememberMe)} onResetPassword={handleResetPassword} error={loginError} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="bg-gradient-to-r from-amber-500 to-amber-600 bg-opacity-90 backdrop-blur-sm border-b border-amber-200/20 mx-0 mt-0 px-6 py-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white capitalize">{activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}</h1>
                <p className="text-amber-100/90 text-sm">Welcome back! Here's what's happening today.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-amber-100/90">
              <button className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </button>
            </div>
          </div>
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