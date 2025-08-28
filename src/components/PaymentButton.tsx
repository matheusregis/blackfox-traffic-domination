import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "./payments/PaymentModal";

type Props = {
  amount: number; // em centavos
  metadata?: Record<string, any>;
  label?: string;
};

export function PaymentButton({ amount, metadata, label = "Pagar" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <PaymentModal
        open={open}
        onOpenChange={setOpen}
        amount={amount}
        metadata={metadata}
      />
    </>
  );
}
