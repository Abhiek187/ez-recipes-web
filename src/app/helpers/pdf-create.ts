import jsPDF from 'jspdf';

/**
 * Wrapper around jsPDF to help with arranging content & paginating
 */
export default class PDFCreate {
  // A4, portrait, and mm by default
  private readonly MARGIN = 12.7;

  // Public in case jsPDF methods should be called directly
  doc = new jsPDF();
  private readonly pageWidth = this.doc.internal.pageSize.width;
  private readonly pageHeight = this.doc.internal.pageSize.height;
  private readonly maxLineWidth = this.pageWidth - this.MARGIN * 2;
  private docY = this.MARGIN;

  private paginate(lines = 1) {
    // Need to paginate manually :(
    this.docY += 10 * lines;

    if (this.docY >= this.pageHeight - this.MARGIN) {
      this.doc.addPage();
      this.docY = this.MARGIN;
    }
  }

  text(text: string) {
    // Split long text across multiple lines
    const textLines = this.doc.splitTextToSize(text, this.maxLineWidth);
    // Check if there's enough room for all the text
    if (this.docY + 10 * textLines.length >= this.pageHeight - this.MARGIN) {
      this.doc.addPage();
      this.docY = this.MARGIN;
    }

    this.doc.text(textLines, this.pageWidth / 2, this.docY, {
      align: 'center',
    });
    this.paginate(textLines.length);
  }

  addImage(url: string, width: number, height: number) {
    this.doc.addImage(
      url,
      'JPEG',
      this.pageWidth / 2,
      this.docY,
      width,
      height,
    );
    this.paginate();
  }
}
