"use client";
import { Attendee, useAttendance } from "@/contexts/attendance-context"; 
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

interface ExportButtonProps {
  attendees: Attendee[];
}

declare module "jspdf" {
  interface jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: (options: any) => jsPDF;
  }
}

const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("No se pudo obtener el contexto del canvas."));
      }
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};

export default function ExportButton({}: ExportButtonProps) {
  const { toast } = useToast();
  const { attendees } = useAttendance();

  const handleExport = async () => {
    if (attendees.length === 0) {
      toast({
        title: "Sin Datos",
        description: "No hay datos de asistencia para exportar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const logoBase64 = await getBase64ImageFromURL("/UNMSM_Transparente.svg");

      const favorAttendees = attendees.filter((a) => a.status === "in-favor");
      const againstAttendees = attendees.filter((a) => a.status === "against");
      const abstainAttendees = attendees.filter((a) => a.status === "abstain");

      const doc = new jsPDF();
      const pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 15;

      const drawHeader = () => {
        const logoWidth = 9;
        const logoHeight = 12;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logoBase64, "PNG", logoX, y, logoWidth, logoHeight);
        y += logoHeight + 5;

        const styles = {
          titulo1: { size: 9, style: "bold" },
          titulo2: { size: 7, style: "italic" },
          titulo3: { size: 7, style: "bold" },
        };

        const drawCenteredText = (
          text: string,
          style: { size: number; style: string },
          vOffset: number
        ) => {
          doc.setFontSize(style.size);
          doc.setFont("helvetica", style.style);
          const textWidth = doc.getTextWidth(text);
          doc.text(text, (pageWidth - textWidth) / 2, y);
          y += vOffset;
        };

        drawCenteredText(
          "UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS",
          styles.titulo1,
          3
        );
        drawCenteredText(
          "Universidad del Perú. Decana de América",
          styles.titulo2,
          3
        );
        drawCenteredText("SECRETARÍA GENERAL", styles.titulo3, 3);

        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
      };

      drawHeader();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const mainTitle = "Reporte de Votación Nominal";
      const mainTitleWidth = doc.getTextWidth(mainTitle);
      doc.text(mainTitle, (pageWidth - mainTitleWidth) / 2, y);
      y += 18;

      const summaryData = [
        ["Fecha de Emisión", new Date().toLocaleDateString()],
        ["Total de Participantes", attendees.length.toString()],
        ["A favor", favorAttendees.length.toString()],
        ["En contra", againstAttendees.length.toString()],
        ["Abstención", abstainAttendees.length.toString()],
      ];

      autoTable(doc, {
        body: summaryData,
        startY: y,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
        margin: { horizontal: margin },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 10;

      const unvotedAttendees = attendees.filter((a) => !a.status);

      const renderSection = (
        title: string,
        people: Attendee[],
        color: [number, number, number]
      ) => {
        if (people.length === 0) return;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(color[0], color[1], color[2]);
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, y);
        y += 8;

        const rows = people.map((p) => [p.name]);
        autoTable(doc, {
          head: [["Nombre de Participante"]],
          body: rows,
          startY: y,
          theme: "grid",
          styles: {
            font: "helvetica",
            fontSize: 10,
          },
          headStyles: {
            fillColor: color,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
          },
          columnStyles: {
            0: { halign: "left", cellWidth: "auto" },
          },
          margin: { horizontal: margin },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y = (doc as any).lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
      };

      renderSection("A favor", favorAttendees, [0, 100, 0]);
      renderSection("En contra", againstAttendees, [200, 0, 0]);
      renderSection("Abstención", abstainAttendees, [200, 160, 0]);
      renderSection("Sin votar", unvotedAttendees, [128, 128, 128]);

      doc.save(
        `reporte-votacion_nominal-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      
      Swal.fire({
        title: "Reporte descargado.",
        text: "El archivo PDF ha sido generado exitosamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
          title: "text-xl font-bold",
          htmlContainer: "text-sm",
        },
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire({
        title: "Fallo al exportar.",
        text: "No se pudo generar el reporte para descargar.",
        icon: "error",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="w-full sm:w-auto cursor-pointer"
      disabled={attendees.length === 0}
    >
      <Download className="mr-2 h-5 w-5" />
      Exportar reporte
    </Button>
  );
}
