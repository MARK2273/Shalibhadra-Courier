import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { numberToWords } from "../utils/numberToWords";
import { currentConfig } from "../constants/courierConfig";

// Register fonts if needed, otherwise use default Helvetica
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2' });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  container: {
    border: "2px solid black",
    height: "100%",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  col: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  logoSection: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  originDestSection: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  odBox: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  odLabel: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
    fontWeight: "bold",
  },
  odValue: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  barcodeSection: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  addressBar: {
    padding: 2,
    backgroundColor: "#eee",
    fontSize: 8,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  addressRow: {
    flexDirection: "row",
    // height: 100, // Removed fixed height
    // minHeight: 100, // Removed minHeight to avoid potential layout issues
    flexShrink: 0, // Prevent shrinking, allowing expansion
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  senderBox: {
    width: "50%",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  receiverBox: {
    width: "50%",
    padding: 5,
    paddingBottom: 10, // Added extra padding for dynamic space
  },
  sectionTitle: {
    fontSize: 8,
    textDecoration: "underline",
    marginBottom: 4,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
  },
  itemsRow: {
    flexDirection: "row",
    height: 80, // Fixed height for items/totals
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  termsQrRow: {
    flexDirection: "row",
    flex: 1, // Take remaining space
  },
  termsText: {
    width: "75%",
    padding: 5,
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "justify",
  },
  qrSection: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  footerRow: {
    flexDirection: "row",
    height: 30,
    borderTopWidth: 1,
    borderTopColor: "#000",
    alignItems: "center",
  },
  // Second Page Styles
  labelPage: {
    flexDirection: "column",
    padding: 10,
    fontFamily: "Times-Roman",
  },
  labelContainer: {
    border: "2px solid black",
    height: "48%", // Adjusted for 2-up layout
    width: "100%",
    flexDirection: "column",
  },
  labelHeader: {
    height: "15%",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  labelBody: {
    flexDirection: "row",
    height: "75%",
  },
  labelLeftCol: {
    width: "80%",
    borderRightWidth: 2,
    borderRightColor: "#000",
    flexDirection: "column",
  },
  labelRightCol: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  receiverSection: {
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    height: "40%",
  },
  destinationSection: {
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    height: "30%",
    justifyContent: "center",
  },
  contentSection: {
    padding: 5,
    height: "30%",
  },
  labelFooter: {
    height: "10%",
    borderTopWidth: 2,
    borderTopColor: "#000",
    justifyContent: "center",
    paddingLeft: 5,
  },
  largeText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  zoneText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Invoice Page Styles
  invoicePage: {
    padding: 20,
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  invoiceContainer: {
    border: "2px solid black",
    height: "100%",
    flexDirection: "column",
  },
  invRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  invCol: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
  },
  invHeaderLeft: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
  },
  invHeaderRight: {
    width: "50%",
    flexDirection: "column",
  },
  invHeaderRightTop: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: "50%",
  },
  invHeaderRightBottom: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  invConsigneeSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 100,
  },
  invRoutingRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 35,
  },
  invTableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    height: 25,
    alignItems: "center",
  },
  invTableBody: {
    flex: 1, // Take available space
    flexDirection: "column",
  },
  invTableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  invFooter: {
    height: 150,
    borderTopWidth: 1,
    borderTopColor: "#000",
    flexDirection: "column",
  },
  invFooterTotal: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 25,
    alignItems: "center",
  },
  invDeclaration: {
    flex: 1,
    padding: 5,
    fontSize: 8,
    flexDirection: "row",
  },
  // Hanny Logistics Page Styles
  hannyPage: {
    padding: 20,
    fontFamily: "Times-Roman",
    fontSize: 10,
    flexDirection: "column",
  },
  hannyLabel: {
    border: "2px solid black",
    height: "48%", // Adjusted to fit two on page
    flexDirection: "column",
  },
  hannyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  hannyHeaderLeft: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    justifyContent: "center",
  },
  hannyHeaderMiddle: {
    width: "20%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    flexDirection: "column",
  },
  hannyHeaderRight: {
    width: "40%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  hannyGridBox: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  hannyGridLabel: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  hannyGridValue: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 10,
  },
  hannySectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 2,
    backgroundColor: "#ccc", // Light gray background for titles like "FROM (SENDER)"
  },
  hannyAddressBox: {
    padding: 4,
    height: 80,
  },
});

interface CourierData {
  header: any;
  sender: any;
  receiver: any;
  items: any[];
  other: any;
  routing: any;
  barcodeBase64?: string;
  qrCodeBase64?: string;
  // billingAmount removed as it is inside 'other'
}

const CourierPdf = ({ data }: { data: CourierData }) => {
  const safeTotalAmount = data.other.totalAmount || 0;
  const safePcs = data.other.pcs || 0;
  const safeWeight = data.other.weight || 0;
  const safeVolWeight = data.other.volumetricWeight || 0;
  // Calculate goods value
  const goodsValue = data.items.reduce(
    (acc: number, item: any) => acc + (Number(item.amount) || 0),
    0,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.row}>
            <View style={styles.logoSection}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {currentConfig.name}
              </Text>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {currentConfig.subName}
              </Text>
              <Text style={{ fontSize: 10 }}>Courier & Cargo</Text>
            </View>
            <View style={styles.originDestSection}>
              <View style={styles.odBox}>
                <View style={styles.odLabel}>
                  <Text>Origin</Text>
                </View>
                <View style={styles.odValue}>
                  <Text>{data.header.origin}</Text>
                </View>
              </View>
              <View style={[styles.odBox, { borderBottomWidth: 0 }]}>
                <View style={styles.odLabel}>
                  <Text>Destination</Text>
                </View>
                <View style={styles.odValue}>
                  <Text>{data.header.destination}</Text>
                </View>
              </View>
            </View>
            <View style={styles.barcodeSection}>
              {data.barcodeBase64 && (
                <Image
                  src={data.barcodeBase64}
                  style={{ width: 140, height: 40 }}
                />
              )}
              <Text style={{ marginTop: 2, fontSize: 9 }}>
                (AWB No): {data.header.awbNo}
              </Text>
              <Text style={{ fontSize: 8 }}>{currentConfig.website}</Text>
            </View>
          </View>

          {/* Address Bar */}
          <View style={styles.addressBar}>
            <Text>{currentConfig.address}</Text>
          </View>

          {/* Sender / Receiver */}
          <View style={styles.addressRow}>
            <View style={styles.senderBox}>
              <Text style={styles.sectionTitle}>FROM (SENDER)</Text>
              <Text style={{ fontWeight: "bold" }}>{data.sender.name}</Text>
              <Text>{data.sender.address}</Text>
              <Text style={{ marginTop: 4 }}>Adhaar: {data.sender.adhaar}</Text>
              <Text>Contact: {data.sender.contact}</Text>
            </View>
            <View style={styles.receiverBox}>
              <Text style={styles.sectionTitle}>TO (RECEIVER)</Text>
              <Text style={{ fontWeight: "bold" }}>{data.receiver.name}</Text>
              <Text>{data.receiver.address}</Text>
              <Text style={{ marginTop: 4 }}>
                Contact: {data.receiver.contact}
              </Text>
            </View>
          </View>

          {/* Service / Shipment Info Header */}
          <View style={styles.tableHeader}>
            <View style={{ width: "30%", borderRightWidth: 1, padding: 4 }}>
              <Text>Service</Text>
            </View>
            <View style={{ width: "40%", borderRightWidth: 1, padding: 4 }}>
              <Text>SHIPMENT INFORMATION</Text>
            </View>
            <View style={{ width: "30%", padding: 4 }}>
              <Text>Total Charge</Text>
            </View>
          </View>

          <View style={styles.itemsRow}>
            {/* Service */}
            <View
              style={{
                width: "30%",
                borderRightWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{data.header.service}</Text>
            </View>

            {/* Shipment Info */}
            <View style={{ width: "40%", borderRightWidth: 1 }}>
              <View
                style={{ flexDirection: "row", borderBottomWidth: 1, flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Text style={{ fontSize: 8 }}>No. Of Box</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Text style={{ fontSize: 8 }}>Weight (kg)</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{safePcs}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{safeWeight}</Text>
                </View>
              </View>
            </View>

            {/* Total Charge */}
            <View style={{ width: "30%" }}>
              <View
                style={{ flexDirection: "row", borderBottomWidth: 1, flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <Text style={{ fontSize: 8 }}>Volumetric Weight</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{safeVolWeight}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                    Total Amount:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    {safeTotalAmount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Terms and QR */}
          <View style={styles.termsQrRow}>
            <View style={styles.termsText}>
              <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
                DESCRIPTION & VALUES OF GOOD (Please attach a commercial invoice
                if shipping parcels):
              </Text>
              <Text>
                SHIPPER/CONSIGNEE IS LIABLE TO PAY CUSTOM DUTY AT DESTINATIONS.
                Items Banned by Narcotics Dept. Liquid, Gases, Chemicals of
                Explosive nature, Bearer chaques, Personal mail, Jewellery,
                Contraband, Drugs, Dangerous Goods or prohibited items are
                strictly not accepted. I/We hereby agree with and accept the
                conditions of Carriage set forth on the reverse of this
                Consigner copy of this nonnegotiable way bill and warrant that
                the information contained on this way bill is true and correct.
              </Text>
              <Text style={{ marginTop: 6, fontWeight: "bold" }}>
                Shipment Total Goods Value = {goodsValue}
              </Text>
              <Text style={{ marginTop: 2, fontWeight: "bold" }}>
                NO CLAIMS FOR SHORT / LATE DELIVERY WILL BE ENTERTAINED.
              </Text>
              <Text style={{ marginTop: 2, fontWeight: "bold" }}>
                IN CASE OF LOST SHIPMENT, {currentConfig.name.toUpperCase()}{" "}
                COURIERS NOT LIABILITY ANY RISK CHARGE
              </Text>
            </View>
            <View style={styles.qrSection}>
              {data.qrCodeBase64 && (
                <Image
                  src={data.qrCodeBase64}
                  style={{ width: 80, height: 80 }}
                />
              )}
              <Text style={{ fontSize: 8, marginTop: 4 }}>
                Scan For Payment
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <View
              style={{
                flex: 1,
                borderRightWidth: 1,
                height: "100%",
                justifyContent: "center",
                paddingLeft: 5,
              }}
            >
              <Text>Date & Time</Text>
            </View>
            <View
              style={{
                flex: 2,
                borderRightWidth: 1,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {data.header.date || new Date().toLocaleString()}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: "100%",
                justifyContent: "center",
                alignItems: "flex-start", // Left align
                paddingLeft: 5, // Add padding
              }}
            >
              <Text>Sign</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Second Page: Label Layout (Duplicate) */}
      <Page size="A4" style={styles.labelPage}>
        <View style={styles.labelContainer}>
          {/* Header: Shalibhadra Specific Layout */}
          <View style={[styles.hannyRow, { height: 80 }]}>
            <View style={styles.hannyHeaderLeft}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {currentConfig.name}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {currentConfig.subName}
              </Text>
              <Text style={{ fontSize: 10, marginTop: 4, textAlign: "center" }}>
                Courier & Cargo
              </Text>
            </View>
            <View style={styles.hannyHeaderMiddle}>
              <View style={styles.hannyGridBox}>
                <View style={styles.hannyGridLabel}>
                  <Text>Origin</Text>
                </View>
                <View style={styles.hannyGridValue}>
                  <Text>{data.header.origin}</Text>
                </View>
              </View>
              <View style={[styles.hannyGridBox, { borderBottomWidth: 0 }]}>
                <View style={styles.hannyGridLabel}>
                  <Text>Destination</Text>
                </View>
                <View style={styles.hannyGridValue}>
                  <Text>{data.header.destination}</Text>
                </View>
              </View>
            </View>
            <View style={styles.hannyHeaderRight}>
              {data.barcodeBase64 && (
                <Image
                  src={data.barcodeBase64}
                  style={{ width: 140, height: 30 }}
                />
              )}
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                (AWB No): {data.header.awbNo}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                {currentConfig.website}
              </Text>
            </View>
          </View>

          {/* Body */}
          <View style={styles.labelBody}>
            {/* Left Column */}
            <View style={styles.labelLeftCol}>
              {/* Receiver Info */}
              <View style={styles.receiverSection}>
                <Text style={{ fontSize: 10, marginBottom: 2 }}>TO</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    marginBottom: 2,
                  }}
                >
                  {data.receiver.name}
                </Text>
                <Text style={{ fontSize: 10, lineHeight: 1.2, width: "90%" }}>
                  {data.receiver.address.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>
                  NO.: {data.receiver.contact}
                </Text>
              </View>

              {/* Destination & Weight */}
              <View style={styles.destinationSection}>
                <Text style={styles.largeText}>
                  {data.header.destination} ({safeWeight} Kg)
                </Text>
              </View>

              {/* Contents */}
              <View style={styles.contentSection}>
                <Text style={{ fontSize: 10 }}>
                  {data.items
                    .map((item) => `${item.description} - ${item.quantity}`)
                    .join(" , ")}{" "}
                  ,
                </Text>
              </View>
            </View>

            {/* Right Column: Zone Code */}
            <View style={styles.labelRightCol}>
              <Text style={styles.zoneText}>M</Text>
              <View
                style={{
                  width: "80%",
                  height: 2,
                  backgroundColor: "black",
                  marginVertical: 5,
                }}
              />
              <Text style={styles.zoneText}>PX</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.labelFooter}>
            <Text style={{ fontSize: 12 }}>{currentConfig.footerText}</Text>
          </View>
        </View>
      </Page>

      {/* Third Page: Commercial Invoice */}
      <Page size="A4" style={styles.invoicePage}>
        <View style={styles.invoiceContainer}>
          {/* Header */}
          <View style={[styles.invRow, { height: 80 }]}>
            <View style={styles.invHeaderLeft}>
              <Text style={{ fontWeight: "bold" }}>Exporter,</Text>
              <Text>{data.sender.name}</Text>
              <Text>{data.sender.address}</Text>
              <Text>Adhar No. - {data.sender.adhaar}</Text>
            </View>
            <View style={styles.invHeaderRight}>
              <View style={styles.invHeaderRightTop}>
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    padding: 4,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 9 }}>Invoice No. & Date</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {data.header.invoiceNo}
                  </Text>
                  <Text>{data.header.invoiceDate}</Text>
                </View>
                <View
                  style={{ width: 60, padding: 4, justifyContent: "center" }}
                >
                  <Text style={{ fontSize: 9 }}>Box :</Text>
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    {data.header.boxNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.invHeaderRightBottom}>
                {data.barcodeBase64 && (
                  <Image
                    src={data.barcodeBase64}
                    style={{ width: 140, height: 30 }}
                  />
                )}
                <Text style={{ fontSize: 9, marginTop: 2 }}>
                  (AWB No): {data.header.awbNo}
                </Text>
              </View>
            </View>
          </View>

          {/* Consignee & Details */}
          <View style={styles.invConsigneeSection}>
            <View style={[styles.invCol, { width: "50%" }]}>
              <Text style={{ fontWeight: "bold" }}>Consignee,</Text>
              <Text>{data.receiver.name}</Text>
              <Text>{data.receiver.address.toUpperCase()}</Text>
              <Text>NO.: {data.receiver.contact}</Text>
            </View>
            <View style={{ width: "50%", flexDirection: "column" }}>
              {/* PCS / Weight Header */}
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  height: 20,
                  alignItems: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <Text style={{ flex: 1, borderRightWidth: 1 }}>PCS</Text>
                <Text style={{ flex: 1, borderRightWidth: 1 }}>Weight</Text>
                <Text style={{ flex: 1 }}>Vol. Weight</Text>
              </View>
              {/* PCS / Weight Values */}
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  height: 30,
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Text style={{ flex: 1, borderRightWidth: 1 }}>{safePcs}</Text>
                <Text style={{ flex: 1, borderRightWidth: 1 }}>
                  {safeWeight}
                </Text>
                <Text style={{ flex: 1 }}>{safeVolWeight}</Text>
              </View>
              {/* Custom Text */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Text style={{ fontSize: 8 }}>
                  Buyer (if other than consignee)
                </Text>
                <Text
                  style={{ fontSize: 7, textAlign: "center", marginBottom: 2 }}
                >
                  BEING SEND FOR PERSONAL USE ONLY NO COMMERCAIL VALUE
                </Text>
                <Text style={{ fontSize: 7, textAlign: "center" }}>
                  VALUE DECLARED FOR CUSTOMS PERPOSE ONLY
                </Text>
              </View>
            </View>
          </View>

          {/* Routing */}
          <View style={styles.invRoutingRow}>
            <View
              style={{
                width: "25%",
                borderRightWidth: 1,
                padding: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 8 }}>Port of Loading</Text>
              <Text>{data.routing.portOfLoading}</Text>
            </View>
            <View
              style={{
                width: "25%",
                borderRightWidth: 1,
                padding: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 8 }}>Final Destination</Text>
              <Text>{data.routing.finalDestination}</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Text style={{ fontSize: 9 }}>COUNTRY OF ORGIN OF GOODS</Text>
                <Text style={{ fontSize: 9, marginLeft: 10 }}>
                  Country of Final Destination :
                </Text>
              </View>
              <Text style={{ marginTop: 2 }}>{data.header.origin}</Text>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.invTableHead}>
            <Text style={{ width: "50%", borderRightWidth: 1 }}>
              Description
            </Text>
            <Text style={{ width: "15%", borderRightWidth: 1 }}>
              Quantity (Pcs)
            </Text>
            <Text style={{ width: "17.5%", borderRightWidth: 1 }}>
              Rate Per Piece
            </Text>
            <Text style={{ width: "17.5%" }}>In INR Amount</Text>
          </View>

          {/* Table Body */}
          <View style={styles.invTableBody}>
            {data.items.map((item, index) => (
              <View key={index} style={styles.invTableRow}>
                <Text
                  style={{
                    width: "50%",
                    borderRightWidth: 1,
                    paddingLeft: 4,
                    fontSize: 9,
                  }}
                >
                  {item.description}
                </Text>
                <Text
                  style={{
                    width: "15%",
                    borderRightWidth: 1,
                    textAlign: "center",
                    fontSize: 9,
                  }}
                >
                  {item.quantity}
                </Text>
                <Text
                  style={{
                    width: "17.5%",
                    borderRightWidth: 1,
                    textAlign: "center",
                    fontSize: 9,
                  }}
                >
                  {item.rate}
                </Text>
                <Text
                  style={{ width: "17.5%", textAlign: "center", fontSize: 9 }}
                >
                  {item.amount}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer Totals */}
          <View style={styles.invFooter}>
            <View style={styles.invFooterTotal}>
              <View
                style={{
                  width: "65%",
                  borderRightWidth: 1,
                  padding: 4,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 9 }}>Amount in words :</Text>
                <Text style={{ fontSize: 9 }}>
                  {numberToWords(safeTotalAmount)} Only
                </Text>
              </View>
              <View
                style={{
                  width: "17.5%",
                  borderRightWidth: 1,
                  padding: 4,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Total</Text>
              </View>
              <View
                style={{
                  width: "17.5%",
                  padding: 4,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{safeTotalAmount}</Text>
              </View>
            </View>

            {/* Declaration & Signature */}
            <View style={styles.invDeclaration}>
              <View style={{ width: "70%" }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  DESCRIPTION & VALUES OF GOOD :
                </Text>
                <Text style={{ lineHeight: 1.2 }}>
                  I/WE authorize Shalibhadra Couriers. to make Computerised
                  invoice on my/ourbehalf for custom purpose. I/WE authorize
                  Shalibhadra Couriers as my /our agent to ship my/our shipments
                  through courier or cargo mode. This shipper has
                  read,understood and agree's to the standard terms and
                  conditions of carriage.
                </Text>
                <Text style={{ marginTop: 10 }}>
                  We declare that this invoice shows the actual price of the
                  good Described and that all particulars are true and correct
                </Text>
              </View>
              <View
                style={{
                  width: "30%",
                  borderLeftWidth: 1,
                  borderTopWidth: 1, // Visual separation
                  marginTop: 40, // Push to bottom
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Text>Signature /Date/Co stamp</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Fourth Page: Hanny Logistics (Duplicate Labels) */}
      <Page size="A4" style={styles.hannyPage}>
        <View style={styles.hannyLabel}>
          {/* Header */}
          <View style={[styles.hannyRow, { height: 80 }]}>
            <View style={styles.hannyHeaderLeft}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                Shalibhadra
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>Couriers</Text>
              <Text style={{ fontSize: 7, marginTop: 4 }}>
                UG-418 TURNING POINT COMPLEX NEAR MAAKHAN BHOG
              </Text>
              <Text style={{ fontSize: 7 }}>GHOD DOD SURAT-395007 /</Text>
              <Text style={{ fontSize: 7 }}>9909408678</Text>
            </View>
            <View style={styles.hannyHeaderMiddle}>
              <View style={styles.hannyGridBox}>
                <View style={styles.hannyGridLabel}>
                  <Text>Origin</Text>
                </View>
                <View style={styles.hannyGridValue}>
                  <Text>{data.header.origin}</Text>
                </View>
              </View>
              <View style={[styles.hannyGridBox, { borderBottomWidth: 0 }]}>
                <View style={styles.hannyGridLabel}>
                  <Text>Destination</Text>
                </View>
                <View style={styles.hannyGridValue}>
                  <Text>{data.header.destination}</Text>
                </View>
              </View>
            </View>
            <View style={styles.hannyHeaderRight}>
              {data.barcodeBase64 && (
                <Image
                  src={data.barcodeBase64}
                  style={{ width: 140, height: 30 }}
                />
              )}
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                (AWB No): {data.header.awbNo}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                www.shalibhadracourier.com
              </Text>
            </View>
          </View>

          {/* Sender / Receiver */}
          <View style={[styles.hannyRow, { height: 100 }]}>
            <View
              style={{
                width: "50%",
                borderRightWidth: 1,
                borderRightColor: "#000",
              }}
            >
              <Text style={styles.hannySectionTitle}>FROM (SENDER)</Text>
              <View style={styles.hannyAddressBox}>
                <Text style={{ fontWeight: "bold" }}>{data.sender.name}</Text>
                <Text>{data.sender.address}</Text>
              </View>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={styles.hannySectionTitle}>TO (RECEIVER)</Text>
              <View style={styles.hannyAddressBox}>
                <Text style={{ fontWeight: "bold" }}>{data.receiver.name}</Text>
                <Text>{data.receiver.address.toUpperCase()}</Text>
                <Text>NO.: {data.receiver.contact}</Text>
              </View>
            </View>
          </View>

          {/* Details Bar */}
          <View style={[styles.hannyRow, { height: 35 }]}>
            <View
              style={{
                width: "30%",
                borderRightWidth: 1,
                borderRightColor: "#000",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8 }}>Service</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>PXC-SELF</Text>
              </View>
            </View>
            <View
              style={{
                width: "30%",
                borderRightWidth: 1,
                borderRightColor: "#000",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8 }}>Company</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>M - PX</Text>
              </View>
            </View>
            <View
              style={{
                width: "20%",
                borderRightWidth: 1,
                borderRightColor: "#000",
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8 }}>No. Of Box</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{safePcs}</Text>
              </View>
            </View>
            <View style={{ width: "20%" }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 8 }}>Weight (kg)</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  {safeWeight} Kg
                </Text>
              </View>
            </View>
          </View>

          {/* Warning Text */}
          <View
            style={{
              padding: 5,
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: "#000",
            }}
          >
            <Text style={{ fontSize: 7 }}>
              DESCRIPTION & VALUES OF GOOD (attached a KYC & commercial / Sample
              invoice Of shipping / parcels):
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginTop: 5 }}>
              Please book shipment only in mentioned weight.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              If any issue then first contact our OPS team
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginTop: 10 }}>
              ShalibhadraCouriers@gmail.com - 9909408678
            </Text>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: "row", height: 25 }}>
            <View
              style={{
                width: "25%",
                borderRightWidth: 1,
                borderRightColor: "#000",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 8 }}>Date & Time</Text>
            </View>
            <View
              style={{
                width: "40%",
                borderRightWidth: 1,
                borderRightColor: "#000",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 9 }}>
                {data.header.date || new Date().toLocaleString()}
              </Text>
            </View>
            <View
              style={{
                width: "35%",
                justifyContent: "center",
                alignItems: "flex-start", // Left align
                paddingLeft: 5, // Add padding
              }}
            >
              <Text style={{ fontSize: 8 }}>Sign</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CourierPdf;
