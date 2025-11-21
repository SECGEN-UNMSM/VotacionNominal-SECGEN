"use client";
import { Attendee, useAttendance } from "@/contexts/attendance-context"; 
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const { attendees, sessionType } = useAttendance();

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

      const presentAttendees = attendees.filter((a) => a.status === "present");
      const absentAttendees = attendees.filter((a) => a.status === "absent");
      const unmarkedAttendees = attendees.filter(
        (a) => a.status === "unmarked"
      );

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
      const mainTitle = "Reporte de Asistencia";
      const mainTitleWidth = doc.getTextWidth(mainTitle);
      doc.text(mainTitle, (pageWidth - mainTitleWidth) / 2, y);
      y += 8;

      if (sessionType) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        const groupTitle =
          sessionType.group === "Consejo"
            ? "Consejo Universitario"
            : "Asamblea Universitaria";
        const groupTitleWidth = doc.getTextWidth(groupTitle);
        doc.text(groupTitle, (pageWidth - groupTitleWidth) / 2, y);
        y += 7;

        doc.setFontSize(12);
        const meetingTitle = `Sesión ${sessionType.meeting}`;
        const meetingTitleWidth = doc.getTextWidth(meetingTitle);
        doc.text(meetingTitle, (pageWidth - meetingTitleWidth) / 2, y);
        y += 10;
      } else {
        y += 10;
      }

      const summaryData = [
        ["Fecha de Emisión", new Date().toLocaleDateString()],
        ["Total de Convocados", attendees.length.toString()],
        ["Asistentes", presentAttendees.length.toString()],
        ["Ausentes", absentAttendees.length.toString()],
        ["Sin Marcar", unmarkedAttendees.length.toString()],
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
      const tableColumn = ["Nombre de Asistente", "Asistencia"];
      const tableRows = attendees.map((attendee) => [
        attendee.name,
        attendee.status === "present"
          ? "Asistente"
          : attendee.status === "absent"
          ? "Ausente"
          : "Sin Marcar",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: y,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left", cellWidth: "auto" },
          1: { halign: "center", cellWidth: 80 },
        },
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 1) {
            const cellText =
              typeof data.cell.raw === "string"
                ? data.cell.raw
                : (data.cell.text && data.cell.text[0]) || "";
            if (cellText === "Asistente") {
              data.cell.styles.textColor = [0, 100, 0];
            } else if (cellText === "Ausente") {
              data.cell.styles.textColor = [200, 0, 0];
            } else if (cellText === "Sin Marcar") {
              data.cell.styles.textColor = [128, 128, 128];
            }
          }
        },
        margin: { horizontal: margin },
        tableWidth: "auto",
      });

      const safeSessionType = sessionType
        ? `_${sessionType.group}_${sessionType.meeting}`.toLowerCase()
        : "";
      doc.save(
        `reporte_asistencia${safeSessionType}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      toast({
        title: "Reporte Descargado",
        description: "El archivo PDF ha sido generado exitosamente.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Fallo al Exportar",
        description: "No se pudo generar el reporte para descargar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
      disabled={attendees.length === 0}
    >
      <Download className="mr-2 h-5 w-5" />
      Exportar reporte
    </Button>
  );
}
