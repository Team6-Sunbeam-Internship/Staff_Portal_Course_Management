// import { toast } from "react-hot-toast";
// import { CheckCircle, XCircle, Loader2 } from "lucide-react";


// export const notify = {
// 	success: (message, options = {}) =>
// 		toast.custom(
// 			(t) => (
// 				<div
// 					className={`flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 shadow-lg ${t.visible ? "animate-enter" : "animate-leave"}`}>
// 					<CheckCircle size={18} className='text-emerald-500' />
// 					<span className='text-emerald-700 dark:text-emerald-400'>{message}</span>
// 				</div>
// 			),
// 			{ duration: 3000, ...options }
// 		),

// 	error: (message, options = {}) =>
// 		toast.custom(
// 			(t) => (
// 				<div
// 					className={`flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 shadow-lg ${t.visible ? "animate-enter" : "animate-leave"}`}>
// 					<XCircle size={18} className='text-rose-500' />
// 					<span className='text-rose-700 dark:text-rose-400'>{message}</span>
// 				</div>
// 			),
// 			{ duration: 4000, ...options }
// 		),

// 	loading: (message = "Processing...") =>
// 		toast.custom(
// 			() => (
// 				<div className='flex items-center gap-3 rounded-2xl border border-zinc-500/30 bg-zinc-500/10 px-4 py-3 shadow-lg'>
// 					<Loader2 size={18} className='animate-spin text-zinc-500' />
// 					<span className='text-zinc-700 dark:text-zinc-300'>{message}</span>
// 				</div>
// 			),
// 			{ duration: Infinity }
// 		),

// 	dismiss: toast.dismiss,
// };

import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { ToastContainer } from "./ToastContainer";

export const notify = {
  success: (message, options = {}) => {
    const duration = options.duration ?? 3000;

    return toast.custom(
      (t) => (
        <ToastContainer
          t={t}
          message={message}
          duration={duration}
          icon={<CheckCircle size={18} className="text-emerald-600" />}
          bg="bg-emerald-50 dark:bg-emerald-950"
          border="border-emerald-400/30"
          text="text-emerald-800 dark:text-emerald-300"
        />
      ),
      { duration, ...options }
    );
  },

  error: (message, options = {}) => {
    const duration = options.duration ?? 4000;

    return toast.custom(
      (t) => (
        <ToastContainer
          t={t}
          message={message}
          duration={duration}
          icon={<XCircle size={18} className="text-rose-600" />}
          bg="bg-rose-50 dark:bg-rose-950"
          border="border-rose-400/30"
          text="text-rose-800 dark:text-rose-300"
        />
      ),
      { duration, ...options }
    );
  },

  loading: (message = "Processing...") =>
    toast.custom(
      (t) => (
        <div className="w-80 rounded-xl border border-zinc-400/30 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-zinc-600" />
            <span className="text-sm text-zinc-800 dark:text-zinc-300">
              {message}
            </span>
          </div>
        </div>
      ),
      { duration: Infinity }
    ),

  dismiss: toast.dismiss,
};
