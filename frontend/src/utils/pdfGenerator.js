import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
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
