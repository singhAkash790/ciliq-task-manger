import React from "react";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import "jspdf-autotable";

const PdfMaker = ({ analyticsData, metrics, timeRange }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Website Analytics", 14, 20);

    // Time range
    doc.setFontSize(12);
    doc.text(`Year: ${timeRange}`, 14, 30);

    // Define table columns
    const columns = ["Month", ...metrics];

    // Prepare rows
    const rows = [];

    // Assuming analyticsData is an array of objects, where each object contains monthly data for different metrics
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let i = 0; i < 12; i++) {
      // Add a row for each month
      const row = [months[i]];

      metrics.forEach((metric, index) => {
        row.push(analyticsData[index]?.data[i] || 0); // Accessing data safely with fallback to 0
      });

      rows.push(row);
    }

    // Create the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save("website-analytics.pdf");
  };

  return (
    <div>
      <Button
        size="small"
        startIcon={<DownloadIcon />}
        sx={{ textTransform: "none" }}
        onClick={generatePDF}
      >
        Export
      </Button>
    </div>
  );
};

export default PdfMaker;
