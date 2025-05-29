// emails>InvoiceEmail.jsx

import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section,
} from "@react-email/components";

export default function InvoiceEmail({ invoice }) {
  const formattedDate = invoice.dueDate?.split("T")[0];
  const amount =
    typeof invoice.amount === "string"
      ? parseFloat(invoice.amount)
      : invoice.amount;

  return (
    <Html>
      <Head />
      <Body
        style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#fff",
            padding: "32px",
            borderRadius: "8px",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            {invoice.business?.logoUrl && (
              <img
                src={invoice.business.logoUrl}
                alt={`${invoice.business.name} Logo`}
                width="100"
                style={{ marginBottom: "12px" }}
              />
            )}
            <Heading style={{ color: "#1f2937", fontSize: "24px" }}>
              Invoice #{invoice.number}
            </Heading>
          </Section>

          <Text style={{ fontSize: "16px", marginBottom: "12px" }}>
            Hi {invoice.customer?.name || "there"},
          </Text>

          <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
            Here’s your invoice from{" "}
            <strong>{invoice.business?.name || "PaperCrate"}</strong>.
          </Text>

          <Hr />

          <Text style={{ fontSize: "16px" }}>
            <strong>Amount Due:</strong> ${amount?.toFixed(2) || "N/A"} <br />
            <strong>Due Date:</strong> {formattedDate || "N/A"}
          </Text>

          <Hr />

          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            {invoice.accessUrl && (
              <Button
                href={invoice.accessUrl}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                View Invoice
              </Button>
            )}
          </Section>

          <Text
            style={{ fontSize: "14px", color: "#6b7280", marginTop: "32px" }}
          >
            If you have any questions, just reply to this email.
          </Text>

          <Text
            style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}
          >
            &copy; {new Date().getFullYear()} PaperCrate.io. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
