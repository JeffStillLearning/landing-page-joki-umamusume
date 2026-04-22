"use client";

import React from "react";
import {
  useOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "@/lib/hooks/useOrders";
import { toast } from "react-toastify";

export default function PesananPage() {
  const { data: orders, isLoading } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success("Status pesanan berhasil diperbarui");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Gagal memperbarui status pesanan");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      try {
        await deleteOrderMutation.mutateAsync(id);
        toast.success("Pesanan berhasil dihapus");
      } catch (error) {
        console.error("Failed to delete order:", error);
        toast.error("Gagal menghapus pesanan");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Pesanan</h2>
          <p className="text-slate-500">
            Lihat dan kelola semua pesanan joki yang masuk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Cari pesanan..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pesanan",
            value: orders?.filter((o) => o.status !== "selesai").length || 0,
            icon: "list_alt",
            color: "blue",
          },
          {
            label: "Menunggu",
            value:
              orders?.filter((o) => o.status === "menunggu_konfirmasi")
                .length || 0,
            icon: "schedule",
            color: "orange",
          },
          {
            label: "Proses",
            value: orders?.filter((o) => o.status === "proses").length || 0,
            icon: "sync",
            color: "purple",
          },
          {
            label: "Selesai",
            value: orders?.filter((o) => o.status === "selesai").length || 0,
            icon: "check_circle",
            color: "green",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}
            >
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className=" border-b border-slate-100 text-slate-800 uppercase text-[12px] font-black tracking-[0.1em]">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Name</th>
                <th className="px-6 py-5">Paket Joki</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5">Total Price</th>
                <th className="px-6 py-5">Note</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5">
                      <div className="h-4 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4  rounded w-24"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4  rounded w-24"></div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="h-8 rounded-lg w-28 mx-auto"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="h-8 rounded-lg w-8 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-pink-50/10 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-mono font-bold text-slate-500 px-2 py-1 rounded-md">
                        {order.orderId?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className=" text-slate-500 text-[15px]">
                        {order.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-700 font-bold text-[13px]">
                        {order.items?.map(item => 
                          item.quantity > 1 
                            ? `${item.packageName} (${item.quantity}x)` 
                            : item.packageName
                        ).join(', ') || '-'}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        {order.customerContact}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="relative inline-block w-full max-w-[160px]">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={
                            updateStatusMutation.isPending &&
                            updateStatusMutation.variables?.id === order.id
                          }
                          className={`w-full text-[10px] text-center border-0 outline-none rounded-lg font-black uppercase tracking-wider px-4 py-2 cursor-pointer appearance-none text-center transition-all ${
                            order.status === "selesai"
                              ? "bg-green-50 text-green-700"
                              : order.status === "proses"
                                ? "bg-blue-50 text-blue-700 "
                                : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          <option value="menunggu_konfirmasi">Menunggu</option>
                          <option value="proses">Proses</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-black text-primary text-[15px]">
                        Rp {order.totalPrice?.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-400 text-[13px] italic leading-relaxed max-w-[180px] truncate group-hover:text-slate-600 transition-colors">
                        {order.note || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className=""
                        title="Hapus Pesanan"
                      >
                        <span className="material-symbols-outlined text-lg hover:text-red-500">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <span className="material-symbols-outlined text-5xl opacity-20">
                        inbox
                      </span>
                      <p className="font-medium">
                        Belum ada pesanan yang masuk hari ini.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
