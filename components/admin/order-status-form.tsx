'use client'

import { useActionState, useEffect } from "react"
import { updateOrderStatusAction } from "@/app/admin/actions"
import { Check, Loader2, AlertCircle } from "lucide-react"

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined }

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [state, formAction, isPending] = useActionState(updateOrderStatusAction, initialState)

  useEffect(() => {
    if (state.success) {
      // Reload or update UI
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }, [state.success])

  const selectClasses = "rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-[#B3702B]/50 focus:ring-4 focus:ring-[#B3702B]/10 transition-all appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23B3702B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E')] bg-[length:10px_10px] bg-[right_0.7rem_center] bg-no-repeat"

  return (
    <form action={formAction} className="flex items-center gap-2 group">
      <input type="hidden" name="orderId" value={orderId} />

      <div className="relative">
        <select
          name="status"
          defaultValue={currentStatus}
          disabled={isPending}
          className={selectClasses}
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-8 items-center justify-center rounded-xl bg-[#B3702B] px-4 text-xs font-bold text-white shadow-lg shadow-[#B3702B]/20 hover:shadow-[#B3702B]/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : state.success ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          "Apply"
        )}
      </button>

      {state.error && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-left-2">
          <AlertCircle className="h-3 w-3" />
          <span>Error</span>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 animate-in fade-in slide-in-from-left-2">
          <Check className="h-3 w-3" />
          <span>Updated</span>
        </div>
      )}
    </form>
  )
}
