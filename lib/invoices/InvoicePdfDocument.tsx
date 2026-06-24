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

/* ── Moroccool company info shown in the "From" block ── */
const MOROCCOOL_INFO = {
  name: "Moroccool",
  address: "Marrakech, Morocco",
  email: "billing@moroccool.com",
  website: "www.moroccool.com",
};

const ACCENT = "#1f6a58";
const ACCENT_LIGHT = "#e8f5f1";
const GOLD = "#806b4e";
const BORDER = "#d9c7a3";
const TEXT_DARK = "#2d251b";
const TEXT_MUTED = "#5b5142";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    paddingTop: 0,
    color: TEXT_DARK,
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  /* ── Accent bar at page top ── */
  accentBar: {
    height: 6,
    backgroundColor: ACCENT,
    marginBottom: 36,
    marginLeft: -48,
    marginRight: -48,
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    paddingBottom: 18,
    marginBottom: 28,
  },
  brand: {
    color: ACCENT,
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
  },
  tagline: {
    color: GOLD,
    fontSize: 8,
    marginTop: 2,
  },
  invoiceBadge: {
    backgroundColor: ACCENT_LIGHT,
    borderColor: ACCENT,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  invoiceBadgeLabel: {
    color: GOLD,
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  invoiceBadgeNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: ACCENT,
  },

  /* ── From / To ── */
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  partyColumn: {
    width: "46%",
  },
  sectionTitle: {
    color: GOLD,
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  partyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    marginBottom: 4,
  },
  line: {
    color: TEXT_MUTED,
    lineHeight: 1.6,
  },
  dividerArrow: {
    justifyContent: "center",
    alignItems: "center",
    width: "8%",
    paddingTop: 18,
  },
  arrow: {
    color: ACCENT,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },

  /* ── Invoice meta ── */
  metaBar: {
    flexDirection: "row",
    backgroundColor: "#f8f4ec",
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  metaItem: {
    alignItems: "center",
    width: "33%",
  },
  metaLabel: {
    color: GOLD,
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },

  /* ── Table ── */
  table: {
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: ACCENT,
    flexDirection: "row",
    padding: 10,
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderTopColor: BORDER,
    borderTopWidth: 1,
  },
  description: { width: "48%" },
  quantity: { width: "17%", textAlign: "right" },
  rate: { width: "20%", textAlign: "right" },
  amount: { width: "15%", textAlign: "right" },
  strong: { fontFamily: "Helvetica-Bold" },

  /* ── Total ── */
  totalContainer: {
    alignSelf: "flex-end",
    width: "45%",
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  totalDivider: {
    borderTopColor: TEXT_DARK,
    borderTopWidth: 2,
    marginBottom: 4,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: ACCENT,
  },

  /* ── Note ── */
  note: {
    backgroundColor: "#f8f4ec",
    borderLeftColor: ACCENT,
    borderLeftWidth: 3,
    borderRadius: 2,
    padding: 12,
    marginBottom: 24,
  },

  /* ── Footer ── */
  footer: {
    borderTopColor: BORDER,
    borderTopWidth: 1,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: GOLD,
    fontSize: 8,
  },
  footerBrand: {
    color: ACCENT,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
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
        {/* ── Green accent bar ── */}
        <View style={styles.accentBar} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Moroccool</Text>
            <Text style={styles.tagline}>Travel & Hospitality Platform</Text>
          </View>
          <View style={styles.invoiceBadge}>
            <Text style={styles.invoiceBadgeLabel}>Invoice</Text>
            <Text style={styles.invoiceBadgeNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* ── From / To ── */}
        <View style={styles.parties}>
          <View style={styles.partyColumn}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.partyName}>{MOROCCOOL_INFO.name}</Text>
            <Text style={styles.line}>{MOROCCOOL_INFO.address}</Text>
            <Text style={styles.line}>{MOROCCOOL_INFO.email}</Text>
            <Text style={styles.line}>{MOROCCOOL_INFO.website}</Text>
          </View>

          <View style={styles.dividerArrow}>
            <Text style={styles.arrow}>→</Text>
          </View>

          <View style={styles.partyColumn}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.partyName}>{invoice.business?.name ?? "Business"}</Text>
            {invoice.business?.address ? <Text style={styles.line}>{invoice.business.address}</Text> : null}
            {invoice.business?.city ? <Text style={styles.line}>{invoice.business.city}</Text> : null}
            {invoice.business?.email ? <Text style={styles.line}>{invoice.business.email}</Text> : null}
            {invoice.business?.phone ? <Text style={styles.line}>{invoice.business.phone}</Text> : null}
          </View>
        </View>

        {/* ── Invoice meta bar ── */}
        <View style={styles.metaBar}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Billing Period</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.periodMonth)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Generated</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.createdAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>{invoice.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Line items table ── */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.description, styles.tableHeaderText]}>Description</Text>
            <Text style={[styles.quantity, styles.tableHeaderText]}>Bookings</Text>
            <Text style={[styles.rate, styles.tableHeaderText]}>Rate</Text>
            <Text style={[styles.amount, styles.tableHeaderText]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.quantity}>{invoice.bookingCount}</Text>
            <Text style={styles.rate}>{rateLabel}</Text>
            <Text style={styles.amount}>{formatMad(invoice.totalAmount)}</Text>
          </View>
        </View>

        {/* ── Total ── */}
        <View style={styles.totalContainer}>
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalValue}>{formatMad(invoice.totalAmount)}</Text>
          </View>
        </View>

        {/* ── Notes ── */}
        {invoice.notes ? (
          <View style={styles.note}>
            <Text style={styles.sectionTitle}>Note</Text>
            <Text style={styles.line}>{invoice.notes}</Text>
          </View>
        ) : null}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for partnering with Moroccool.
          </Text>
          <Text style={styles.footerBrand}>
            {MOROCCOOL_INFO.email}  ·  {MOROCCOOL_INFO.website}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

