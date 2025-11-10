import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { forwardRef, memo } from "react";

interface DownloadPDFButtonProps {
    targetId: string;
    fileName?: string;
}

const DownloadPDFButton = forwardRef<HTMLButtonElement, DownloadPDFButtonProps>(({
    targetId,
    fileName = "health-report.pdf",
}, ref) => {

    const handleDownload = async () => {
        const element = document.getElementById(targetId);
        if (!element) return alert("Target not found!");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

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
    };

    return (
        <Button
            ref={ref}
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
        >
            Download as PDF
        </Button>
    );
});

export default memo(DownloadPDFButton);
