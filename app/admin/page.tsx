"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  LogOut,
  RefreshCw,
  ExternalLink,
  Shield,
  Star,
  Eye,
  EyeOff,
  Clock,
  Phone,
  Mail,
  Search,
  AlertCircle,
  Lock,
  Sparkles,
  UploadCloud,
  Bed,
  Edit3,
  Save,
  Check
} from "lucide-react";

interface BookingItem {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  roomType: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  createdAt: string;
}

interface GalleryItemType {
  _id: string;
  src: string;
  title: string;
  subtitle: string;
  category: "scenery" | "property" | "rooms" | "interior";
  aspect: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

interface ReviewItem {
  _id: string;
  author: string;
  origin: string;
  tag: string;
  quote: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenueEst: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  totalPhotos: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "reviews" | "gallery" | "rooms">("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItemType[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const [roomSaveSuccess, setRoomSaveSuccess] = useState("");
  const [roomSaveError, setRoomSaveError] = useState("");
  const [quickPrices, setQuickPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters & Search
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"pending" | "approved" | "all">("pending");

  // Gallery Add Modal
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newPhoto, setNewPhoto] = useState({
    src: "",
    title: "",
    subtitle: "",
    category: "scenery",
    aspect: "aspect-[4/3]",
    order: 0,
    isVisible: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewPhoto((prev) => ({
          ...prev,
          src: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
      } else {
        setUploadError(data.message || "Upload failed. Please choose an image file under 10MB.");
      }
    } catch {
      setUploadError("Image upload error. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Check auth status on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch admin data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAdminData() {
      setLoading(true);
      try {
        const [statsRes, bookingsRes, reviewsRes, galleryRes, roomsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch(`/api/bookings?status=${bookingFilter}`),
          fetch("/api/reviews?admin=true"),
          fetch("/api/gallery?admin=true"),
          fetch("/api/rooms?admin=true"),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats(s.stats);
        }
        if (bookingsRes.ok) {
          const b = await bookingsRes.json();
          setBookings(b.bookings || []);
        }
        if (reviewsRes.ok) {
          const r = await reviewsRes.json();
          setReviews(r.reviews || []);
        }
        if (galleryRes.ok) {
          const g = await galleryRes.json();
          setGallery(g.items || []);
        }
        if (roomsRes && roomsRes.ok) {
          const rm = await roomsRes.json();
          const list = rm.rooms || [];
          setRooms(list);
          const priceMap: Record<string, number> = {};
          list.forEach((r: any) => {
            priceMap[r.roomId] = r.pricePerNight;
          });
          setQuickPrices(priceMap);
        }
      } catch (e) {
        console.error("Failed to load admin data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [isAuthenticated, bookingFilter, refreshKey]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
      } else {
        setLoginError(data.message || "Invalid password");
      }
    } catch {
      setLoginError("Connection failed. Please check network.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
      }
    } catch (e) {
      console.error("Error updating booking:", e);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Error deleting booking:", e);
    }
  };

  // Review Actions
  const handleApproveReview = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Error approving review:", e);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this user review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Error deleting review:", e);
    }
  };

  // Gallery Actions
  const handleTogglePhotoVisibility = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !current }),
      });
      if (res.ok) setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Error updating photo:", e);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error("Error deleting photo:", e);
    }
  };

  // Room Packages Actions
  const handleSaveRoomPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    setIsSavingRoom(true);
    setRoomSaveSuccess("");
    setRoomSaveError("");

    try {
      const res = await fetch(`/api/rooms/${editingRoom.roomId || editingRoom._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRoom),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRoomSaveSuccess(`Rates for "${editingRoom.name}" updated successfully.`);
        setRooms((prev) =>
          prev.map((r) => (r.roomId === editingRoom.roomId ? data.room : r))
        );
        setEditingRoom(null);
        setTimeout(() => setRoomSaveSuccess(""), 4000);
      } else {
        setRoomSaveError(data.message || "Failed to update room package.");
      }
    } catch {
      setRoomSaveError("Network error while updating room package.");
    } finally {
      setIsSavingRoom(false);
    }
  };

  const handleQuickPriceSave = async (roomId: string) => {
    const newPrice = Number(quickPrices[roomId]);
    if (isNaN(newPrice) || newPrice < 0) return;

    setIsSavingRoom(true);
    setRoomSaveSuccess("");
    setRoomSaveError("");

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricePerNight: newPrice }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRoomSaveSuccess(`Price updated to $${newPrice}/night successfully.`);
        setRooms((prev) =>
          prev.map((r) => (r.roomId === roomId ? { ...r, pricePerNight: newPrice, priceLabel: `$${newPrice}` } : r))
        );
        setTimeout(() => setRoomSaveSuccess(""), 4000);
      } else {
        setRoomSaveError(data.message || "Failed to update price.");
      }
    } catch {
      setRoomSaveError("Network error while updating price.");
    } finally {
      setIsSavingRoom(false);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.src) {
      setUploadError("Please choose and upload a photo from your computer first.");
      return;
    }
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhoto),
      });
      if (res.ok) {
        setIsAddPhotoOpen(false);
        setUploadError("");
        setNewPhoto({
          src: "",
          title: "",
          subtitle: "",
          category: "scenery",
          aspect: "aspect-[4/3]",
          order: 0,
          isVisible: true,
        });
        setRefreshKey((k) => k + 1);
      } else {
        setUploadError("Failed to save photo to gallery.");
      }
    } catch (e) {
      console.error("Error adding photo:", e);
      setUploadError("Network error while saving photo.");
    }
  };

  // Loading state during auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#17271D] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#C58E47] animate-spin" />
          <span className="text-sm font-medium tracking-wider text-white/80">
            Checking Administrator Access...
          </span>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D1912] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#17271D] border border-[#233F2C] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#C58E47]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C58E47] shadow-lg mb-3 bg-white">
              <Image src="/logo.jpeg" alt="Dawn Breezy Bungalow Logo" fill className="object-cover" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Dawn Breezy Bungalow
            </h1>
            <p className="text-xs text-[#C58E47] font-mono uppercase tracking-widest mt-1">
              Host Administration Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#0D1912] border border-[#233F2C] rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#C58E47] transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-[#7B887E] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-[#C58E47] hover:bg-[#A97633] text-white text-sm font-bold shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#233F2C] text-center">
            <Link
              href="/"
              className="text-xs text-[#7B887E] hover:text-[#C58E47] transition-colors inline-flex items-center gap-1"
            >
              <span>Back to website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter Bookings by Search
  const filteredBookings = bookings.filter((b) => {
    if (!bookingSearch) return true;
    const s = bookingSearch.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(s) ||
      b.customerPhone.toLowerCase().includes(s) ||
      b.roomName.toLowerCase().includes(s)
    );
  });

  // Filter Reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "pending") return !r.isApproved;
    if (reviewFilter === "approved") return r.isApproved;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#1F2923] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#17271D] border-b border-[#233F2C] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C58E47] bg-white">
              <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-wide">
                  Dawn Breezy Bungalow
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#C58E47]/20 text-[#DFB775] border border-[#C58E47]/30">
                  Host Admin
                </span>
              </div>
              <div className="text-[11px] text-[#A5B0A8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>System Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/40 text-red-200 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EAE5DC] pb-4 mb-6 sm:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeTab === "overview"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "bg-white text-[#4F6154] hover:bg-gray-100 border border-[#EAE5DC]"
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap relative ${activeTab === "bookings"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "bg-white text-[#4F6154] hover:bg-gray-100 border border-[#EAE5DC]"
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings &amp; Inquiries</span>
            {stats && stats.pendingBookings > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C58E47] text-white text-[10px] font-bold flex items-center justify-center">
                {stats.pendingBookings}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap relative ${activeTab === "reviews"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "bg-white text-[#4F6154] hover:bg-gray-100 border border-[#EAE5DC]"
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Guest Comments Approval</span>
            {stats && stats.pendingReviews > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {stats.pendingReviews}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeTab === "gallery"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "bg-white text-[#4F6154] hover:bg-gray-100 border border-[#EAE5DC]"
              }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Customize Gallery</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-[#4F6154] font-mono">
              {gallery.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeTab === "rooms"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "bg-white text-[#4F6154] hover:bg-gray-100 border border-[#EAE5DC]"
              }`}
          >
            <Bed className="w-4 h-4" />
            <span>Room Rates &amp; Packages</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C58E47]/20 text-[#C58E47] font-mono font-bold">
              {rooms.length || 3}
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            {/* 4 Metrics Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#7B887E] uppercase tracking-wider">
                    Pending Bookings
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C58E47] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#243D2C]">
                  {stats?.pendingBookings || 0}
                </div>
                <p className="text-[11px] text-[#7B887E] mt-1">Awaiting your confirmation</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#7B887E] uppercase tracking-wider">
                    Confirmed Stays
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#243D2C]">
                  {stats?.confirmedBookings || 0}
                </div>
                <p className="text-[11px] text-[#7B887E] mt-1">
                  Est. Rev: ${stats?.totalRevenueEst || 0}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#7B887E] uppercase tracking-wider">
                    Pending Comments
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#243D2C]">
                  {stats?.pendingReviews || 0}
                </div>
                <p className="text-[11px] text-[#7B887E] mt-1">User reviews awaiting approval</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#7B887E] uppercase tracking-wider">
                    Live Gallery Photos
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-pine-50 text-[#243D2C] flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#243D2C]">
                  {stats?.totalPhotos || 0}
                </div>
                <p className="text-[11px] text-[#7B887E] mt-1">Active photos in carousel &amp; grid</p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-[#17271D] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C58E47]/20 border border-[#C58E47]/40 text-[#DFB775] text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Host Management Center</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">
                  Welcome Susantha
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Review new booking requests, approve guest comments, and update gallery photos across the website.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 relative z-10">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="px-5 py-2.5 rounded-full bg-[#C58E47] hover:bg-[#A97633] text-white text-xs font-bold transition-all shadow-md"
                >
                  Review Bookings
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20"
                >
                  Approve Comments ({stats?.pendingReviews || 0})
                </button>
              </div>
            </div>

            {/* Recent Bookings Snapshot */}
            <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE5DC]">
                <h4 className="font-serif text-lg font-bold text-[#243D2C]">
                  Latest Booking Requests
                </h4>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-[#C58E47] hover:underline"
                >
                  View All →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7B887E]">
                  No bookings received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#F8F9F7] border border-[#EAE5DC] gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#243D2C]">{b.customerName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#7B887E] mt-0.5">
                          {b.roomName} • {new Date(b.checkIn).toLocaleDateString()} to{" "}
                          {new Date(b.checkOut).toLocaleDateString()} ({b.nights} nights)
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#243D2C]">${b.totalPrice}</span>
                        <a
                          href={`tel:${b.customerPhone.replace(/[^0-9+]/g, "")}`}
                          className="px-3 py-1 rounded-lg bg-[#243D2C] hover:bg-[#17271D] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                          title="Call guest directly"
                        >
                          <Phone className="w-3 h-3 text-[#DFB775]" />
                          <span>Call Guest</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {["all", "pending", "confirmed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${bookingFilter === st
                      ? "bg-[#243D2C] text-white shadow-xs"
                      : "bg-[#F8F9F7] text-[#4F6154] hover:bg-gray-100"
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search guest or phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1F2923] focus:outline-hidden focus:border-[#C58E47] w-full sm:w-64"
                />
                <Search className="w-3.5 h-3.5 text-[#7B887E] absolute left-3 top-3" />
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE5DC]">
                <Calendar className="w-12 h-12 text-[#C58E47]/40 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#243D2C]">No Bookings Found</h4>
                <p className="text-xs text-[#7B887E] mt-1">
                  Try changing your status filter or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-xs flex flex-col justify-between hover:border-[#DFB775] transition-colors"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#7B887E] block">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <h4 className="font-serif text-base font-bold text-[#243D2C]">
                            {b.customerName}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* Details Box */}
                      <div className="space-y-1.5 text-xs text-[#4F6154] bg-[#F8F9F7] p-3 rounded-xl border border-[#EAE5DC] mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Room:</span>
                          <span className="font-bold text-[#243D2C]">{b.roomName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Check-In:</span>
                          <span className="font-semibold">
                            {new Date(b.checkIn).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Check-Out:</span>
                          <span className="font-semibold">
                            {new Date(b.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Stay Duration:</span>
                          <span>
                            {b.nights} night{b.nights > 1 ? "s" : ""} • {b.guests} guests
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#EAE5DC]">
                          <span className="font-bold text-[#243D2C]">Total Price:</span>
                          <span className="font-bold text-base text-[#C58E47]">
                            ${b.totalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 text-xs mb-4">
                        <div className="flex items-center gap-1.5 text-[#243D2C]">
                          <Phone className="w-3.5 h-3.5 text-[#C58E47]" />
                          <span className="font-mono font-medium">{b.customerPhone}</span>
                        </div>
                        {b.customerEmail && (
                          <div className="flex items-center gap-1.5 text-[#7B887E]">
                            <Mail className="w-3.5 h-3.5 text-[#C58E47]" />
                            <span>{b.customerEmail}</span>
                          </div>
                        )}
                        {b.specialRequests && (
                          <div className="text-[11px] text-[#7B887E] italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 mt-2">
                            &ldquo;{b.specialRequests}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between gap-2">
                      <a
                        href={`tel:${b.customerPhone.replace(/[^0-9+]/g, "")}`}
                        className="px-3 py-1.5 rounded-xl bg-[#243D2C] hover:bg-[#17271D] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                        title="Call guest directly"
                      >
                        <Phone className="w-3 h-3 text-[#DFB775]" />
                        <span>Call Guest</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b._id, "confirmed")}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b._id, "cancelled")}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300"
                            title="Decline/Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          title="Delete Booking Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS & USER COMMENTS APPROVAL */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewFilter("pending")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${reviewFilter === "pending"
                    ? "bg-[#243D2C] text-white shadow-xs"
                    : "bg-[#F8F9F7] text-[#4F6154] hover:bg-gray-100"
                    }`}
                >
                  Pending Approval ({reviews.filter((r) => !r.isApproved).length})
                </button>
                <button
                  onClick={() => setReviewFilter("approved")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${reviewFilter === "approved"
                    ? "bg-[#243D2C] text-white shadow-xs"
                    : "bg-[#F8F9F7] text-[#4F6154] hover:bg-gray-100"
                    }`}
                >
                  Approved ({reviews.filter((r) => r.isApproved).length})
                </button>
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${reviewFilter === "all"
                    ? "bg-[#243D2C] text-white shadow-xs"
                    : "bg-[#F8F9F7] text-[#4F6154] hover:bg-gray-100"
                    }`}
                >
                  All Comments ({reviews.length})
                </button>
              </div>
            </div>

            {/* Reviews Cards */}
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE5DC]">
                <MessageSquare className="w-12 h-12 text-[#C58E47]/40 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#243D2C]">
                  No {reviewFilter} Comments Found
                </h4>
                <p className="text-xs text-[#7B887E] mt-1">
                  {reviewFilter === "pending"
                    ? "Great! All submitted guest comments have been reviewed."
                    : "No comments match this filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-[#C58E47]">
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${r.isApproved
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                            }`}
                        >
                          {r.isApproved ? "Approved & Live" : "Pending Approval"}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#243529] italic leading-relaxed mb-4">
                        &ldquo;{r.quote}&rdquo;
                      </p>

                      <div className="text-xs text-[#4F6154]">
                        <span className="font-bold text-[#243D2C]">{r.author}</span>
                        {r.origin && <span> • {r.origin}</span>}
                        {r.tag && (
                          <div className="text-[10px] text-[#C58E47] font-semibold mt-0.5">
                            {r.tag}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE5DC] mt-4 flex items-center justify-between">
                      {r.isApproved ? (
                        <button
                          onClick={() => handleApproveReview(r._id, false)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#4F6154] text-xs font-semibold flex items-center gap-1"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Unpublish</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveReview(r._id, true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve &amp; Publish</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY CUSTOMIZER */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#243D2C]">Gallery Photos</h4>
                <p className="text-xs text-[#7B887E]">
                  Add, hide, or delete photos shown on the homepage gallery
                </p>
              </div>

              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-[#EAE5DC] overflow-hidden shadow-xs flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <Image src={item.src} alt={item.title} fill className="object-cover" />
                    {!item.isVisible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-1">
                        <EyeOff className="w-4 h-4" />
                        <span>Hidden from public</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono capitalize">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3.5">
                    <h5 className="font-bold text-xs sm:text-sm text-[#243D2C] line-clamp-1">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#7B887E] line-clamp-1 mt-0.5">
                      {item.subtitle || "No subtitle"}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#EAE5DC] flex items-center justify-between">
                      <button
                        onClick={() => handleTogglePhotoVisibility(item._id, item.isVisible)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${item.isVisible
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.isVisible ? "Visible" : "Hidden"}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePhoto(item._id)}
                        className="p-1 rounded-md text-red-600 hover:bg-red-50"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Photo Modal */}
            {isAddPhotoOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
                  <h3 className="font-serif text-xl font-bold text-[#243D2C] mb-4">
                    Add Photo to Gallery
                  </h3>

                  <form onSubmit={handleAddPhotoSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1.5">
                        Upload Photo from Device *
                      </label>

                      {newPhoto.src ? (
                        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#DFB775] bg-gray-100 mb-2 group">
                          <Image
                            src={newPhoto.src}
                            alt="Uploaded photo preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                              htmlFor="photo-upload-input"
                              className="cursor-pointer px-3 py-1.5 rounded-xl bg-white text-[#243D2C] text-xs font-bold hover:bg-gray-100 shadow-md"
                            >
                              Replace Image
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="photo-upload-input"
                          className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#DFB775]/60 hover:border-[#C58E47] bg-[#FAF9F5] hover:bg-[#F2EFE9] rounded-2xl cursor-pointer transition-colors p-4 text-center"
                        >
                          {isUploadingPhoto ? (
                            <div className="flex flex-col items-center gap-2 text-xs text-[#C58E47] font-semibold">
                              <RefreshCw className="w-6 h-6 animate-spin" />
                              <span>Uploading image to villa storage...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-[#7B887E]">
                              <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#C58E47]">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-[#243D2C]">
                                Click to choose Photo
                              </span>
                              <span className="text-[10px] text-[#7B887E]">
                                Supports JPG, PNG, WebP, AVIF up to 10MB
                              </span>
                            </div>
                          )}
                        </label>
                      )}

                      <input
                        id="photo-upload-input"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {uploadError && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Photo Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pine Valley Sunrise"
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2923]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Subtitle / Short Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Beautiful mountain mist from the private veranda"
                        value={newPhoto.subtitle}
                        onChange={(e) => setNewPhoto({ ...newPhoto, subtitle: e.target.value })}
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2923]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Category
                        </label>
                        <select
                          value={newPhoto.category}
                          onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3 py-2 text-xs text-[#1F2923]"
                        >
                          <option value="scenery">Scenery</option>
                          <option value="property">Property</option>
                          <option value="rooms">Rooms</option>
                          <option value="interior">Interior</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Aspect Ratio
                        </label>
                        <select
                          value={newPhoto.aspect}
                          onChange={(e) => setNewPhoto({ ...newPhoto, aspect: e.target.value })}
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3 py-2 text-xs text-[#1F2923]"
                        >
                          <option value="aspect-[4/3]">Standard (4:3)</option>
                          <option value="aspect-[16/10]">Wide (16:10)</option>
                          <option value="aspect-[4/5]">Portrait (4:5)</option>
                          <option value="aspect-square">Square (1:1)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE5DC]">
                      <button
                        type="button"
                        onClick={() => setIsAddPhotoOpen(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#4F6154]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold shadow-xs"
                      >
                        Save Photo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ROOM RATES & PACKAGE CUSTOMIZATION */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-[11px] font-bold text-[#A97633] mb-1.5">
                  <Bed className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>Villa Pricing Engine</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-[#243D2C]">
                  Room Rates &amp; Package Details
                </h4>
                <p className="text-xs text-[#7B887E] mt-0.5 max-w-2xl">
                  Adjust nightly prices, guest capacities, descriptions, and package inclusions for the 3 villa stay options. Updates reflect live across the website and booking calendar immediately.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#4F6154] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Rates</span>
                </button>
              </div>
            </div>

            {/* Success and Error Alerts */}
            {roomSaveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{roomSaveSuccess}</span>
              </div>
            )}
            {roomSaveError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{roomSaveError}</span>
              </div>
            )}

            {/* 3 Room Package Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const currentQuickPrice = quickPrices[room.roomId] ?? room.pricePerNight ?? 0;
                return (
                  <div
                    key={room.roomId || room._id}
                    className="bg-white rounded-3xl border border-[#EAE5DC] hover:border-[#DFB775] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Top Header Strip */}
                      <div className="p-5 border-b border-[#EAE5DC] bg-[#FAF9F5]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#243D2C] text-white">
                            {room.roomNumber || "OPTION"}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47] bg-[#C58E47]/15 px-2 py-0.5 rounded-full">
                            {room.categoryTag || "VILLA OPTION"}
                          </span>
                        </div>
                        <h5 className="font-serif text-lg font-bold text-[#1F2923] leading-snug">
                          {room.name}
                        </h5>
                        <p className="text-xs text-[#7B887E] mt-1 line-clamp-1">
                          {room.subtitle || "Peaceful highland mountain retreat"}
                        </p>
                      </div>

                      {/* Pricing Control Box */}
                      <div className="p-5 border-b border-[#EAE5DC] bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-[#7B887E] uppercase tracking-wider">
                            Rate Per Night
                          </span>
                          <span className="font-serif text-2xl font-bold text-[#243D2C]">
                            ${room.pricePerNight}
                            <span className="text-xs font-normal text-[#7B887E] ml-1">/ night</span>
                          </span>
                        </div>

                        {/* Inline Quick Price Changer */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#F0EBE1]">
                          <label className="text-xs font-semibold text-[#1F2923] whitespace-nowrap">
                            Quick Price:
                          </label>
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7B887E]">
                              $
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={currentQuickPrice}
                              onChange={(e) =>
                                setQuickPrices({
                                  ...quickPrices,
                                  [room.roomId]: Number(e.target.value),
                                })
                              }
                              className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-[#DFB775]/70 focus:border-[#C58E47] bg-[#FAF9F5] text-xs font-bold text-[#1F2923] focus:outline-hidden"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuickPriceSave(room.roomId)}
                            disabled={isSavingRoom}
                            className="px-3.5 py-1.5 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>

                      {/* Specs & Highlights */}
                      <div className="p-5 space-y-3 text-xs text-[#4F6154]">
                        <div className="flex items-center justify-between py-1 border-b border-[#F0EBE1]">
                          <span className="text-[#7B887E]">Capacity:</span>
                          <span className="font-semibold text-[#1F2923]">{room.capacity}</span>
                        </div>
                        {room.specs?.bed && (
                          <div className="flex items-center justify-between py-1 border-b border-[#F0EBE1]">
                            <span className="text-[#7B887E]">Bed Setup:</span>
                            <span className="font-semibold text-[#1F2923] text-right line-clamp-1">{room.specs.bed}</span>
                          </div>
                        )}
                        {room.specs?.bathroom && (
                          <div className="flex items-center justify-between py-1 border-b border-[#F0EBE1]">
                            <span className="text-[#7B887E]">Bathroom:</span>
                            <span className="font-semibold text-[#1F2923] text-right line-clamp-1">{room.specs.bathroom}</span>
                          </div>
                        )}

                        <div className="pt-2">
                          <span className="block text-[11px] font-bold text-[#7B887E] uppercase tracking-wider mb-2">
                            Key Package Features ({room.features?.length || 0})
                          </span>
                          <ul className="space-y-1.5">
                            {(room.features || []).slice(0, 4).map((f: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-[#4F6154]">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRoom({
                            ...room,
                            featuresText: (room.features || []).join("\n"),
                            amenitiesText: (room.amenities || []).join("\n"),
                            goodToKnowText: (room.goodToKnow || []).join("\n"),
                            bedSpec: room.specs?.bed || "",
                            sleepsSpec: room.specs?.sleeps || "",
                            outlookSpec: room.specs?.outlook || "",
                            bathroomSpec: room.specs?.bathroom || "",
                          })
                        }
                        className="w-full py-2.5 px-4 rounded-xl border border-[#243D2C] hover:bg-[#243D2C] text-[#243D2C] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Customize Package Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FULL PACKAGE DETAILS EDIT MODAL */}
            {editingRoom && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE5DC] my-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC] mb-5">
                    <div>
                      <div className="text-[10px] font-bold text-[#C58E47] uppercase tracking-wider">
                        {editingRoom.roomNumber} • {editingRoom.roomId}
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#243D2C]">
                        Edit Package: {editingRoom.name}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingRoom(null)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-[#7B887E] transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      const updatedPayload = {
                        ...editingRoom,
                        pricePerNight: Number(editingRoom.pricePerNight),
                        priceLabel: `$${editingRoom.pricePerNight}`,
                        features: (editingRoom.featuresText || "")
                          .split("\n")
                          .map((s: string) => s.trim())
                          .filter(Boolean),
                        amenities: (editingRoom.amenitiesText || "")
                          .split("\n")
                          .map((s: string) => s.trim())
                          .filter(Boolean),
                        goodToKnow: (editingRoom.goodToKnowText || "")
                          .split("\n")
                          .map((s: string) => s.trim())
                          .filter(Boolean),
                        specs: {
                          bed: editingRoom.bedSpec || "",
                          sleeps: editingRoom.sleepsSpec || "",
                          outlook: editingRoom.outlookSpec || "",
                          bathroom: editingRoom.bathroomSpec || "",
                        },
                      };
                      setEditingRoom(updatedPayload);
                      handleSaveRoomPackage(e);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Room / Package Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingRoom.name || ""}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, name: e.target.value })
                          }
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Price Per Night (USD $)
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editingRoom.pricePerNight || 0}
                          onChange={(e) =>
                            setEditingRoom({
                              ...editingRoom,
                              pricePerNight: Number(e.target.value),
                            })
                          }
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Subtitle / Catchphrase
                        </label>
                        <input
                          type="text"
                          value={editingRoom.subtitle || ""}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, subtitle: e.target.value })
                          }
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Sleeping Capacity Label
                        </label>
                        <input
                          type="text"
                          value={editingRoom.capacity || ""}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, capacity: e.target.value })
                          }
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingRoom.description || ""}
                        onChange={(e) =>
                          setEditingRoom({ ...editingRoom, description: e.target.value })
                        }
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl p-3 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Bed Setup
                        </label>
                        <input
                          type="text"
                          value={editingRoom.bedSpec || ""}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, bedSpec: e.target.value })
                          }
                          placeholder="e.g. 1 Extra-Large Double Bed"
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                          Bathroom Setup
                        </label>
                        <input
                          type="text"
                          value={editingRoom.bathroomSpec || ""}
                          onChange={(e) =>
                            setEditingRoom({ ...editingRoom, bathroomSpec: e.target.value })
                          }
                          placeholder="e.g. Private Hot-Water Bathroom"
                          className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Package Inclusions / Highlights (One feature per line)
                      </label>
                      <textarea
                        rows={4}
                        value={editingRoom.featuresText || ""}
                        onChange={(e) =>
                          setEditingRoom({ ...editingRoom, featuresText: e.target.value })
                        }
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl p-3 text-xs text-[#1F2923] focus:border-[#C58E47] focus:outline-hidden font-mono"
                        placeholder="One inclusion per line"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE5DC]">
                      <button
                        type="button"
                        onClick={() => setEditingRoom(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#4F6154]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingRoom}
                        className="px-5 py-2 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSavingRoom ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Package Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
