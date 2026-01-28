import { X } from "lucide-react";
import { toast } from "react-hot-toast";

export const ToastContainer = ({
  t,
  message,
  icon,
  bg,
  border,
  text,
  duration,
}) => {
  return (
    <div
      className={`
        relative
        min-w-[360px] max-w-[480px]
        rounded-2xl
        border ${border} ${bg}
        px-5 py-4
        shadow-xl
        ${t.visible ? "animate-enter" : "animate-leave"}
      `}
    >
      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">
          {icon}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p
            className={`text-sm leading-relaxed break-words ${text}`}
          >
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-2xl">
        <div
          className="h-full bg-current animate-toast-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
      <div className="h-full bg-gradient-to-r from-transparent via-current to-current animate-toast-progress" />
    </div>
  );
};
