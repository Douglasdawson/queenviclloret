import { useTranslation } from "react-i18next";
import { Dialog } from "./Dialog";
import { ReservationForm } from "./ReservationForm";
import { useReservationModal } from "../app/reservation-modal";

/** Single global reservation-request modal, mounted once in PublicLayout. */
export function ReservationModal() {
  const { t } = useTranslation();
  const { isOpen, close } = useReservationModal();
  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()} title={t("reservations.modalTitle")}>
      <p className="-mt-2 mb-5 text-[0.9375rem] leading-relaxed text-ink-600">
        {t("reservations.subtitle")}
      </p>
      <ReservationForm />
    </Dialog>
  );
}
