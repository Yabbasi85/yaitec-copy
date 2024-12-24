import React from "react";
import { Button } from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface GeneratePDFButtonProps {
  ebookTitle: string;
  chapters: { title: string; content: string; image?: string }[];
  toast: (options: any) => void;
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({ ebookTitle, chapters, toast }) => {
  const handleGeneratePDF = async () => {
    if (!ebookTitle) {
      toast({
        title: "Error",
        description: "Please provide a title for your ebook.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Página de capa
    doc.setFillColor(85, 65, 255);  // Cor roxa da marca
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(255, 255, 255);  // Texto branco
    doc.setFontSize(40);
    doc.text(ebookTitle, pageWidth / 2, pageHeight / 2, { align: "center" });
    doc.setFontSize(20);
    doc.text("Created with Ebook Studio", pageWidth / 2, pageHeight / 2 + 20, { align: "center" });

    // Sumário
    doc.addPage();
    doc.setTextColor(0, 0, 0);  // Texto preto
    doc.setFontSize(24);
    doc.text("Table of Contents", margin, margin + 10);
    doc.setFontSize(12);
    let tocY = margin + 30;
    chapters.forEach((chapter, index) => {
      doc.text(`Chapter ${index + 1}: ${chapter.title}`, margin, tocY);
      tocY += 10;
    });

    // Capítulos
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      doc.addPage();

      // Título do capítulo
      doc.setFillColor(85, 65, 255);  // Cor roxa da marca
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);  // Texto branco
      doc.setFontSize(24);
      doc.text(`Chapter ${index + 1}: ${chapter.title}`, pageWidth / 2, 25, { align: "center" });

      // Conteúdo do capítulo
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      let contentY = 50;

      // Imagem do capítulo (se houver)
      if (chapter.image) {
        try {
          const img = await loadImage(chapter.image);
          const imgProps = doc.getImageProperties(img);
          const imgWidth = Math.min(pageWidth - 2 * margin, 100);
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          doc.addImage(img, 'JPEG', margin, contentY, imgWidth, imgHeight);
          contentY += imgHeight + 10;
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }

      // Dividindo o texto para caber na página
      const splitText = doc.splitTextToSize(chapter.content, pageWidth - 2 * margin);
      splitText.forEach((line: string) => {
        if (contentY > pageHeight - margin) {
          doc.addPage();
          contentY = margin;
        }
        doc.text(line, margin, contentY);
        contentY += 7;
      });
    }

    doc.save(`${ebookTitle.replace(/\s+/g, "_")}.pdf`);
    toast({
      title: "PDF generated",
      description: "Your beautiful ebook has been successfully generated!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Função para carregar imagem
  const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      bgGradient="linear(to-r, #00ff89, #5541ff)"
      _hover={{ bgGradient: "linear(to-r, #1DCFFF, #5541ff)" }}
      h="48px"
      borderRadius="8px"
      color="white"
    >
      Generate Beautiful PDF
    </Button>
  );
};

export default GeneratePDFButton;
