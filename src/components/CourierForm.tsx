import React, { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/FormStyles.css";
import { countryList, serviceOptions } from "../constants/formOptions";
import { numberToWords } from "../utils/numberToWords";
import { pdf } from "@react-pdf/renderer";
import CourierPdf from "./CourierPdf";
import { currentConfig } from "../constants/courierConfig";
import bwipjs from "bwip-js";
import QRCode from "qrcode";

interface LineItem {
  id: number;
  description: string;
  boxNo: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CourierData {
  header: {
    service: string;
    awbNo: string;
    origin: string;
    destination: string;
    date: string;
    invoiceNo: string;
    invoiceDate: string;
    boxNumber: string;
    serviceDetails: string; // Added field for extra service info
  };
  sender: {
    name: string; // Exporter/Shipper
    address: string;
    adhaar: string;
    contact: string; // Added
    email: string; // Added
  };
  receiver: {
    name: string; // Consignee
    address: string;
    contact: string;
    email: string; // Added
  };
  routing: {
    portOfLoading: string;
    finalDestination: string;
    originCountry: string;
    finalCountry: string; // Added field for "Country of Final Destination"
  };
  items: LineItem[];
  other: {
    pcs: number;
    weight: string;
    volumetricWeight: string;
    currency: string;
    totalAmount: number;
    amountInWords: string; // Added field
    billingAmount: number; // Renamed from ourAmount
  };
}

const CourierForm: React.FC = () => {
  const [formData, setFormData] = useState<CourierData>({
    header: {
      service: "",
      awbNo: "",
      origin: "",
      destination: "",
      date: "",
      invoiceNo: "",
      invoiceDate: "",
      boxNumber: "",
      serviceDetails: "",
    },
    sender: {
      name: "",
      address: "",
      adhaar: "",
      contact: "",
      email: "",
    },
    receiver: {
      name: "",
      address: "",
      contact: "",
      email: "",
    },
    routing: {
      portOfLoading: "",
      finalDestination: "",
      originCountry: "",
      finalCountry: "",
    },
    items: [
      {
        id: 1,
        description: "",
        boxNo: "1",
        hsnCode: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ],
    other: {
      pcs: 0,
      weight: "",
      volumetricWeight: "",
      currency: "INR",
      totalAmount: 0,
      amountInWords: "Zero Only",
      billingAmount: 0,
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Initialization Effect: Set Current Date
  useEffect(() => {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:mm for datetime-local
    // Adjust to local timezone (approximate for UI)
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, date: localIso },
    }));
  }, []);

  // Calculate generic total and Amount in Words when items change
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const words = numberToWords(Math.round(total));

    setFormData((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        totalAmount: total,
        amountInWords: words,
      },
    }));
  }, [formData.items]);

  const handleNestedChange = (
    section: keyof CourierData,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleItemChange = (id: number, field: keyof LineItem, value: any) => {
    setFormData((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  // Generate Box Options based on Header Box No
  const boxCount = parseInt(formData.header.boxNumber) || 1;
  const boxOptions = Array.from({ length: boxCount }, (_, i) => i + 1);

  const addItem = () => {
    const newId =
      formData.items.length > 0
        ? Math.max(...formData.items.map((i) => i.id)) + 1
        : 1;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: "",
          boxNo: "1",
          hsnCode: "",
          quantity: 0,
          rate: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // 0. Save to Backend
      try {
        const payload = {
          sender_name: formData.sender.name,
          sender_address: formData.sender.address,
          receiver_name: formData.receiver.name,
          receiver_address: formData.receiver.address,
          invoice_number: formData.header.invoiceNo,
          invoice_date: formData.header.invoiceDate, // Ensure format matches date or string
          origin: formData.header.origin,
          destination: formData.header.destination,
          box_count: parseInt(formData.header.boxNumber) || 1,
          packages: formData.items,
        };
        await api.post("/form/create", payload);
        console.log("Shipment saved to backend");
      } catch (apiError) {
        console.error("Failed to save shipment:", apiError);
        alert("Failed to save shipment to database, but proceeding with PDF.");
      }

      // 1. Generate Barcode (Code 128)
      let barcodeBase64 = "";
      try {
        const canvas = document.createElement("canvas");
        bwipjs.toCanvas(canvas, {
          bcid: "code128", // Barcode type
          text: formData.header.awbNo || "12345678", // Text to encode
          scale: 3, // 3x scaling factor
          height: 10, // Bar height, in millimeters
          includetext: false, // Show human-readable text
          textxalign: "center", // Always good to set this
        });
        barcodeBase64 = canvas.toDataURL("image/png");
      } catch (e) {
        console.error("Barcode Generation Error:", e);
      }

      // 2. Generate QR Code
      let qrCodeBase64 = "";
      try {
        const qrData = `AWB: ${formData.header.awbNo}\nAmount: ${formData.other.totalAmount}`;
        qrCodeBase64 = await QRCode.toDataURL(qrData);
      } catch (e) {
        console.error("QR Generation Error:", e);
      }

      // 3. Prepare Data
      const pdfData = {
        ...formData,
        barcodeBase64,
        qrCodeBase64,
      };

      // 4. Generate PDF Blob
      const blob = await pdf(<CourierPdf data={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="courier-dashboard">
        {/* Header Bar */}
        <div className="dashboard-header">
          <div className="logo-section">
            <h1>{currentConfig.displayName}</h1>

            <p>Courier & Cargo</p>
          </div>
          <div className="header-fields">
            <div className="field-block">
              <label>Origin</label>
              <select
                value={formData.header.origin}
                onChange={(e) =>
                  handleNestedChange("header", "origin", e.target.value)
                }
              >
                <option value="">Select Origin</option>
                {countryList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-block">
              <label>Destination</label>
              <select
                value={formData.header.destination}
                onChange={(e) =>
                  handleNestedChange("header", "destination", e.target.value)
                }
              >
                <option value="">Select Destination</option>
                {countryList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-block">
              <label>AWB No.</label>
              <input
                type="text"
                value={formData.header.awbNo}
                onChange={(e) =>
                  handleNestedChange("header", "awbNo", e.target.value)
                }
                className="highlight-input"
                placeholder="AWB Number"
              />
            </div>
            <div className="field-block">
              <label>Date</label>
              <input
                type="datetime-local"
                value={formData.header.date}
                onChange={(e) =>
                  handleNestedChange("header", "date", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Invoice Info Bar */}
        <div className="info-bar">
          <div className="ib-col">
            <label>Invoice No.</label>
            <input
              type="text"
              value={formData.header.invoiceNo}
              onChange={(e) =>
                handleNestedChange("header", "invoiceNo", e.target.value)
              }
              placeholder="Enter Invoice No"
            />
          </div>
          <div className="ib-col">
            <label>Invoice Date</label>
            <input
              type="text"
              value={formData.header.invoiceDate}
              onChange={(e) =>
                handleNestedChange("header", "invoiceDate", e.target.value)
              }
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="ib-col">
            <label>Box No.</label>
            <input
              type="number"
              min="1"
              value={formData.header.boxNumber}
              onChange={(e) =>
                handleNestedChange("header", "boxNumber", e.target.value)
              }
              placeholder="Box No"
            />
          </div>
        </div>

        {/* Parties Section */}
        <div className="parties-container">
          <div className="party-box sender-box">
            <h3>Exporter (Sender)</h3>
            <input
              type="text"
              value={formData.sender.name}
              onChange={(e) =>
                handleNestedChange("sender", "name", e.target.value)
              }
              placeholder="Sender Name"
              className="address-input-name"
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <textarea
              rows={3}
              value={formData.sender.address}
              onChange={(e) =>
                handleNestedChange("sender", "address", e.target.value)
              }
              className="address-area"
              placeholder="Address Line 1&#10;Address Line 2"
            />
            <div className="sub-field">
              <label>Adhar No:</label>
              <input
                type="text"
                value={formData.sender.adhaar}
                onChange={(e) =>
                  handleNestedChange("sender", "adhaar", e.target.value)
                }
                placeholder="Enter Adhaar No"
              />
            </div>
            {/* Added Sender Email & Contact */}
            <div className="sub-field">
              <label>Contact No:</label>
              <input
                type="text"
                value={formData.sender.contact}
                onChange={(e) =>
                  handleNestedChange("sender", "contact", e.target.value)
                }
                placeholder="Sender Phone No"
              />
            </div>
            <div className="sub-field">
              <label>Email:</label>
              <input
                type="email"
                value={formData.sender.email}
                onChange={(e) =>
                  handleNestedChange("sender", "email", e.target.value)
                }
                placeholder="Sender Email"
              />
            </div>
          </div>

          <div className="party-box receiver-box">
            <h3>Consignee (Receiver)</h3>
            <input
              type="text"
              value={formData.receiver.name}
              onChange={(e) =>
                handleNestedChange("receiver", "name", e.target.value)
              }
              placeholder="Receiver Name"
              className="address-input-name"
              style={{ marginBottom: "5px", width: "100%" }}
            />
            <textarea
              rows={3}
              value={formData.receiver.address}
              onChange={(e) =>
                handleNestedChange("receiver", "address", e.target.value)
              }
              className="address-area"
              placeholder="Address Line 1&#10;Address Line 2"
            />
            <div className="sub-field">
              <label>Contact No:</label>
              <input
                type="text"
                value={formData.receiver.contact}
                onChange={(e) =>
                  handleNestedChange("receiver", "contact", e.target.value)
                }
                placeholder="Receiver Phone No"
              />
            </div>
            {/* Added Receiver Email */}
            <div className="sub-field">
              <label>Email:</label>
              <input
                type="email"
                value={formData.receiver.email}
                onChange={(e) =>
                  handleNestedChange("receiver", "email", e.target.value)
                }
                placeholder="Receiver Email"
              />
            </div>
          </div>
        </div>

        {/* Simplified Routing Grid */}
        <div className="routing-grid">
          <div className="r-item">
            <label>Port of Loading</label>
            <input
              type="text"
              value={formData.routing.portOfLoading}
              onChange={(e) =>
                handleNestedChange("routing", "portOfLoading", e.target.value)
              }
              placeholder="Loading Port"
            />
          </div>
          <div className="r-item" style={{ gridColumn: "span 2" }}>
            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}
            >
              <div style={{ flex: 1 }}>
                <label>Service</label>

                <select
                  value={formData.header.service}
                  onChange={(e) =>
                    handleNestedChange("header", "service", e.target.value)
                  }
                >
                  <option value="">Select Service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              {formData.header.service && (
                <div style={{ flex: 1.5 }}>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "0.4rem",
                      display: "block",
                    }}
                  >
                    Tracking No
                  </label>
                  <input
                    type="text"
                    value={formData.header.serviceDetails || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "header",
                        "serviceDetails",
                        e.target.value,
                      )
                    }
                    placeholder="Enter Tracking No"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="items-section">
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Box No</th>
                <th>Description</th>
                <th style={{ width: "100px" }}>HSN Code</th>
                <th style={{ width: "80px" }}>Qty</th>
                <th style={{ width: "100px" }}>Rate</th>
                <th style={{ width: "120px" }}>
                  Amount ({formData.other.currency})
                </th>
                <th style={{ width: "50px" }}></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <select
                      value={item.boxNo}
                      onChange={(e) =>
                        handleItemChange(item.id, "boxNo", e.target.value)
                      }
                    >
                      {boxOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      placeholder="Item Description"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) =>
                        handleItemChange(item.id, "hsnCode", e.target.value)
                      }
                      placeholder="HSN"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.rate || ""}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "rate",
                          Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.amount || ""}
                      readOnly
                      className="read-only"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-actions">
            <button type="button" onClick={addItem} className="btn-add">
              + Add Item
            </button>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="footer-section">
          <div className="footer-left">
            <p>
              <strong>Amount in words:</strong> [Auto-generated Amount Words]
            </p>
            <p className="declaration">
              We declare that this invoice shows the actual price of the good
              Described and that all particulars are true and correct.
            </p>
          </div>
          <div className="footer-right">
            <div className="total-row">
              <span>Total PCS:</span>
              <input
                type="number"
                min="0"
                value={formData.other.pcs || ""}
                onChange={(e) =>
                  handleNestedChange("other", "pcs", e.target.value)
                }
                className="small-input"
                placeholder="0"
              />
            </div>
            {/* Added Volumetric Weight */}
            <div className="total-row">
              <span>Volumetric Wt:</span>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.other.volumetricWeight}
                onChange={(e) =>
                  handleNestedChange(
                    "other",
                    "volumetricWeight",
                    e.target.value,
                  )
                }
                className="small-input"
                placeholder="0.00"
              />
            </div>
            <div className="total-row">
              <span>Total Weight:</span>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.other.weight}
                onChange={(e) =>
                  handleNestedChange("other", "weight", e.target.value)
                }
                className="small-input"
                placeholder="0.00"
              />
            </div>
            <div className="total-row main-total">
              <span>Total Amount:</span>
              <span>{formData.other.totalAmount}</span>
            </div>
            <div className="total-row">
              <span>Billing Amount:</span>
              <input
                type="number"
                min="0"
                value={formData.other.billingAmount}
                onChange={(e) =>
                  handleNestedChange("other", "billingAmount", e.target.value)
                }
                className="small-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="final-actions">
          <button type="submit" className="btn-primary" disabled={isGenerating}>
            {isGenerating ? "GENERATING..." : "GENERATE PDF / PRINT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourierForm;
