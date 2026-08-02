import { writable } from 'svelte/store';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onclick: () => void;
  };
};

let toastCount = 0;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function add(toast: Omit<Toast, 'id'>) {
    const id = `toast-${++toastCount}`;
    const duration = toast.duration ?? 5000;

    update((t) => [...t, { ...toast, id }]);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }

  function remove(id: string) {
    update((t) => t.filter((toast) => toast.id !== id));
  }

  function success(title: string, description?: string) {
    return add({ title, description, type: 'success' });
  }

  function error(title: string, description?: string) {
    return add({ title, description, type: 'error', duration: 8000 });
  }

  function warning(title: string, description?: string) {
    return add({ title, description, type: 'warning' });
  }

  function info(title: string, description?: string) {
    return add({ title, description, type: 'info' });
  }

  function dismiss(id: string) {
    remove(id);
  }

  function dismissAll() {
    update(() => []);
  }

  return {
    subscribe,
    add,
    remove,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}

export const toasts = createToastStore();
