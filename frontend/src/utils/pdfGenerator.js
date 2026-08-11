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
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(text, maxWidth);
    let cursorY = margin;

    lines.forEach((line) => {
        if (cursorY > pageHeight - margin) {
            pdf.addPage();
            cursorY = margin;
        }
        pdf.text(line, margin, cursorY);
        cursorY += lineHeight;
    });

    pdf.save(fileName);
};

export const downloadResumePDF = async (elementId, fileName = "resume.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Resume element not found");
        return;
    }

    // Temporarily reset scale for accurate capture
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;
    element.style.transform = "scale(1)";
    element.style.transformOrigin = "top left";

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const margin = 18;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pdfWidth - margin * 2;
        const contentHeight = pdfHeight - margin * 2;
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;

        while (heightLeft > 0) {
            position = margin - (imgHeight - heightLeft);
            pdf.addPage();
            pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
            heightLeft -= contentHeight;
        }

        pdf.save(fileName);
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw error;
    } finally {
        // Restore original styles
        element.style.transform = originalTransform;
        element.style.transformOrigin = originalTransformOrigin;
    }
};

export default downloadResumePDF;
