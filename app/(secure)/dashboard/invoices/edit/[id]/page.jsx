import AltInvoiceForm from "@/components/forms/invoices/AltInvoiceForm";

export default function EditInvoicePage({ params }) {
  const { id } = params;

  return <AltInvoiceForm invoiceId={id} />;
}
