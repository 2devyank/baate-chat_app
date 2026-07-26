import { useEffect, useState } from "react";
import "../styles/toast.css";

type ToastType = "error" | "success" | "info";

export type ToastEventDetail = {
  message: string;
  type?: ToastType;
};

type ToastItem = Required<ToastEventDetail> & {
  id: number;
};

const TOAST_EVENT = "chatapp:toast";

export const showToast = (message: string, type: ToastType = "info") => {
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>(TOAST_EVENT, {
      detail: { message, type },
    })
  );
};

const ToastProvider = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const toastEvent = event as CustomEvent<ToastEventDetail>;
      const message = toastEvent.detail?.message?.trim();
      if (!message) return;

      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type: toastEvent.detail.type || "info",
        },
      ]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4200);
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="toaststack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.type}`} key={toast.id}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
