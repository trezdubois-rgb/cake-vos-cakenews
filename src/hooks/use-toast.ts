<<<<<<< HEAD
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';
=======
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

<<<<<<< HEAD
=======
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

<<<<<<< HEAD
type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: ToasterToast['id'] }
  | { type: 'REMOVE_TOAST'; toastId?: ToasterToast['id'] };

let memoryState: State = { toasts: [] };

const listeners: Array<(state: State) => void> = [];
=======
type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
<<<<<<< HEAD
      type: 'REMOVE_TOAST',
=======
      type: "REMOVE_TOAST",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
<<<<<<< HEAD
    case 'ADD_TOAST':
=======
    case "ADD_TOAST":
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

<<<<<<< HEAD
    case 'UPDATE_TOAST':
=======
    case "UPDATE_TOAST":
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

<<<<<<< HEAD
    case 'DISMISS_TOAST': {
=======
    case "DISMISS_TOAST": {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
<<<<<<< HEAD
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
=======
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

<<<<<<< HEAD
=======
const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

<<<<<<< HEAD
type Toast = Omit<ToasterToast, 'id'>;
=======
type Toast = Omit<ToasterToast, "id">;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
<<<<<<< HEAD
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
=======
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
<<<<<<< HEAD
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
=======
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
