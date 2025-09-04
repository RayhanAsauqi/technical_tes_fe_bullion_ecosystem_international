import { useToast } from "vue-toastification";

export const useNotification = () => {
  const toast = useToast();

  const ToastSuccess = (message: string) => {
    return toast.success(message);
  };

  const ToastError = (message: string) => {
    return toast.error(message);
  };

  const ToastInfo = (message: string) => {
    return toast.info(message);
  };

  const ToastWarning = (message: string) => {
    return toast.warning(message);
  };

  return {
    ToastSuccess,
    ToastError,
    ToastInfo,
    ToastWarning,
  };
};

export const { ToastError, ToastInfo, ToastSuccess, ToastWarning } = useNotification();
