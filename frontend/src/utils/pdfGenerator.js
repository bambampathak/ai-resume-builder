import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadTextPDF = (text, fileName = "cover-letter.pdf") => {
    if (!text) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 18;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    pdf.setFont("times", "normal");

    let cursorY = margin;
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.text("Cover Letter", margin, cursorY);
    cursorY += lineHeight * 1.5;

    pdf.setFontSize(12);
    pdf.setFont("times", "normal");

    const paragraphs = String(text)
        .trim()
        .split(/\n{2,}/g)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    paragraphs.forEach((paragraph, paragraphIndex) => {
        const lines = pdf.splitTextToSize(paragraph, maxWidth);
        lines.forEach((line) => {
            if (cursorY > pageHeight - margin) {
                pdf.addPage();
                cursorY = margin;
            }
            pdf.text(line, margin, cursorY);
            cursorY += lineHeight;
        });
        if (paragraphIndex < paragraphs.length - 1) {
            cursorY += lineHeight;
        }
    });

    pdf.save(fileName);
};

export const downloadResumePDF = async (elementId, fileName = "resume.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Resume element #${elementId} not found in DOM`);
    }

    // A4 at 96 dpi = 794px wide
    const A4_WIDTH_PX = 794;

    // Clone the element off-screen at full A4 size.
    // This avoids issues with the live element being scaled, hidden, or clipped.
    const clone = element.cloneNode(true);
    Object.assign(clone.style, {
        position: "fixed",
        top: "-99999px",
        left: "-99999px",
        width: `${A4_WIDTH_PX}px`,
        minHeight: "auto",
        transform: "none",
        transformOrigin: "top left",
        zIndex: "-9999",
        visibility: "visible",
        display: "block",
        overflow: "visible",
        boxSizing: "border-box",
        background: "#ffffff",
        padding: "20mm 18mm",
    });
    document.body.appendChild(clone);

    // Give the browser a moment to lay out the clone
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
            width: A4_WIDTH_PX,
            windowWidth: A4_WIDTH_PX,
        });

        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            throw new Error("Canvas render returned empty output");
        }

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = -(imgHeight - heightLeft);
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(fileName);
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw error;
    } finally {
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
        }
    }
};

export default downloadResumePDF;
