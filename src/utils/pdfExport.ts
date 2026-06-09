import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportElementToPDF(elementId: string, filename: string = 'Documento_Hermético.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Generate a canvas from the specific element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: '#09090b', // Default dark theme background to avoid transparent black bugs
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit the PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;
    const pdfRatio = pdfWidth / pdfHeight;

    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;

    if (imgRatio > pdfRatio) {
      // Image is wider than PDF
      finalHeight = pdfWidth / imgRatio;
    } else {
      // Image is taller than PDF
      finalWidth = pdfHeight * imgRatio;
    }

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
    
    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
