import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../buttons";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  type = "danger",
}) => {
  const isDanger = type === "danger";

  const theme = isDanger 
    ? {
        icon: AlertTriangle,
        primaryColor: "text-rose-500",
        secondaryColor: "bg-rose-500/10",
        btnGradient: "from-rose-500 to-rose-600 shadow-rose-500/25",
        bgIconColor: "text-rose-500/[0.03] dark:text-rose-500/[0.05]"
      }
    : {
        icon: ClipboardCheck,
        primaryColor: "text-amber-500",
        secondaryColor: "bg-amber-500/10",
        btnGradient: "from-amber-400 to-amber-600 shadow-amber-500/25",
        bgIconColor: "text-amber-500/[0.03] dark:text-amber-500/[0.05]"
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="relative p-8">
                {/* Decorative Background Icon */}
                <div className="absolute -top-6 -right-6 pointer-events-none select-none">
                  <theme.icon size={180} strokeWidth={1} className={theme.bgIconColor} />
                </div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${theme.secondaryColor} ${theme.primaryColor} mb-6`}>
                    <theme.icon size={28} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-2">
                    {title}
                  </h3>
                  
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 p-6 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  onClick={onClose}
                 variant="gradientEmerald"
                >
                  Cancel
                </Button>
                <Button
								  onClick={onConfirm}
								  variant="gradientRose"
                 
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
