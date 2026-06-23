import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type InvoicePdfData = {
  invoiceNumber: string;
  periodMonth: string | null;
  createdAt: string;
  status: string;
  bookingCount: number;
  commissionValue: number;
  totalAmount: number;
  notes: string | null;
  billingModel: "percentage" | "per_booking";
  business: {
    name: string | null;
    city: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    color: "#2d251b",
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#d9c7a3",
    borderBottomWidth: 1,
    paddingBottom: 18,
    marginBottom: 26,
  },
  brand: {
    color: "#1f6a58",
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
  },
  eyebrow: {
    color: "#806b4e",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    textAlign: "right",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  detailsColumn: {
    width: "46%",
  },
  sectionTitle: {
    color: "#806b4e",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  businessName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    marginBottom: 4,
  },
  line: {
    color: "#5b5142",
    lineHeight: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  metaLabel: {
    color: "#806b4e",
  },
  table: {
    borderColor: "#d9c7a3",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: "#f3eadb",
    flexDirection: "row",
    padding: 9,
  },
  tableRow: {
    flexDirection: "row",
    padding: 9,
  },
  description: {
    width: "48%",
  },
  quantity: {
    width: "17%",
    textAlign: "right",
  },
  rate: {
    width: "20%",
    textAlign: "right",
  },
  amount: {
    width: "15%",
    textAlign: "right",
  },
  strong: {
    fontFamily: "Helvetica-Bold",
  },
  total: {
    alignSelf: "flex-end",
    width: "45%",
    borderTopColor: "#2d251b",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    marginBottom: 22,
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
  note: {
    backgroundColor: "#f8f4ec",
    borderLeftColor: "#1f6a58",
    borderLeftWidth: 3,
    padding: 10,
    marginBottom: 24,
  },
  footer: {
    borderTopColor: "#d9c7a3",
    borderTopWidth: 1,
    color: "#806b4e",
    fontSize: 8,
    paddingTop: 12,
    textAlign: "center",
  },
});

function formatMad(value: number) {
  return `MAD ${value.toFixed(2)}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoicePdfData }) {
  const rateLabel =
    invoice.billingModel === "percentage"
      ? `${invoice.commissionValue}%`
      : `${formatMad(invoice.commissionValue)} / booking`;
  const description =
    invoice.billingModel === "percentage"
      ? `Platform commission for confirmed accommodation stays — ${formatDate(invoice.periodMonth)}`
      : `Platform fee for confirmed dining bookings — ${formatDate(invoice.periodMonth)}`;

  return (
    <Document title={`Invoice ${invoice.invoiceNumber}`} author="Moroccool">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Platform billing</Text>
            <Text style={styles.brand}>Moroccool</Text>
          </View>
          <View>
            <Text style={styles.eyebrow}>Invoice</Text>
            <Text style={styles.title}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailsColumn}>
            <Text style={styles.sectionTitle}>Bill to</Text>
            <Text style={styles.businessName}>{invoice.business?.name ?? "Business"}</Text>
            {invoice.business?.address ? <Text style={styles.line}>{invoice.business.address}</Text> : null}
            {invoice.business?.city ? <Text style={styles.line}>{invoice.business.city}</Text> : null}
            {invoice.business?.email ? <Text style={styles.line}>{invoice.business.email}</Text> : null}
            {invoice.business?.phone ? <Text style={styles.line}>{invoice.business.phone}</Text> : null}
          </View>

          <View style={styles.detailsColumn}>
            <Text style={styles.sectionTitle}>Invoice details</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Billing period</Text>
              <Text>{formatDate(invoice.periodMonth)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Generated</Text>
              <Text>{formatDate(invoice.createdAt)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text>{invoice.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.description, styles.strong]}>Description</Text>
            <Text style={[styles.quantity, styles.strong]}>Bookings</Text>
            <Text style={[styles.rate, styles.strong]}>Rate</Text>
            <Text style={[styles.amount, styles.strong]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.quantity}>{invoice.bookingCount}</Text>
            <Text style={styles.rate}>{rateLabel}</Text>
            <Text style={styles.amount}>{formatMad(invoice.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text>Total due</Text>
          <Text>{formatMad(invoice.totalAmount)}</Text>
        </View>

        {invoice.notes ? (
          <View style={styles.note}>
            <Text style={styles.sectionTitle}>Note</Text>
            <Text style={styles.line}>{invoice.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          Thank you for partnering with Moroccool.
        </Text>
      </Page>
    </Document>
  );
}
