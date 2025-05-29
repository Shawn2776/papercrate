import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

export default function ReminderEmail({
  customerName,
  invoiceNumber,
  businessName,
  accessUrl,
}) {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}
      >
        <Container style={{ backgroundColor: "#fff", padding: "24px" }}>
          <Heading as="h2">Reminder: Invoice #{invoiceNumber}</Heading>
          <Text>Hi {customerName || "there"},</Text>
          <Text>
            Your invoice from {businessName || "your service provider"} will
            expire in 24 hours.
          </Text>
          <Button
            href={accessUrl}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            View Invoice
          </Button>
          <Text style={{ fontSize: "12px", color: "#888", marginTop: "24px" }}>
            This link will expire soon. Please save a copy if needed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
