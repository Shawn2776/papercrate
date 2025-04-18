// components/DemoAuditTable.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const mockLogs = [
  {
    id: "1",
    performedAt: new Date().toISOString(),
    action: "CREATE",
    entityType: "Product",
    user: { name: "Shawn", email: "shawn@example.com" },
  },
  {
    id: "2",
    performedAt: new Date().toISOString(),
    action: "UPDATE",
    entityType: "Customer",
    user: { name: "Alex", email: "alex@example.com" },
  },
];

export default function DemoAuditTable() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handlePDF = async () => {
    if (!tableRef.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await new Promise<void>((resolve) => {
        html2pdf()
          .from(tableRef.current!)
          .set({
            filename: "demo-audit-logs.pdf",
            margin: 10,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save();
        setTimeout(resolve, 800);
      });
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    if (!tableRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Print Audit Logs</title></head>
        <body>${tableRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handlePDF} disabled={exporting}>
          Download PDF
        </Button>
        <Button onClick={handlePrint}>Print</Button>
      </div>

      <div ref={tableRef} className="border p-4 rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">User</th>
              <th className="text-left">Action</th>
              <th className="text-left">Entity</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.performedAt).toLocaleString()}</td>
                <td>
                  {log.user.name} ({log.user.email})
                </td>
                <td>{log.action}</td>
                <td>{log.entityType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exporting && <p className="text-sm">Generating PDF...</p>}
    </div>
  );
}
