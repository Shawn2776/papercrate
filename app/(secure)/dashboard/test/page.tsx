// components/DemoAuditTable.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const handlePDF = async () => {
    if (!tableRef.current) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      html2pdf()
        .from(tableRef.current)
        .set({
          filename: "audit-logs.pdf",
        })
        .save();
    } catch (err) {
      console.error("PDF generation failed:", err);
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
                <td>
                  {clientReady
                    ? new Date(log.performedAt).toLocaleString()
                    : new Date(log.performedAt).toISOString()}
                </td>
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
