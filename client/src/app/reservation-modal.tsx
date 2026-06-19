import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ReservationModalValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ReservationModalContext = createContext<ReservationModalValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function ReservationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return (
    <ReservationModalContext.Provider value={value}>{children}</ReservationModalContext.Provider>
  );
}

export const useReservationModal = () => useContext(ReservationModalContext);
