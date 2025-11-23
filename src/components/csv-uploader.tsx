"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import {
  useAttendance,
} from "@/contexts/attendance-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function CsvUploader() {
  const { loadAttendees } = useAttendance();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      Swal.fire({
        title: "No se seleccionó ningún archivo.",
        text: "Por favor, selecciona un archivo CSV para iniciar.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text
          .split(/\r\n|\n/)
          .filter((line) => line.trim() !== "");

        let names: string[];
        if (
          lines.length > 0 &&
          /name|nombre|attendee|asistente|participant|participante/i.test(
            lines[0].split(",")[0]
          )
        ) {
          names = lines
            .slice(1)
            .map((line) => line.split(",")[0].trim())
            .filter((name) => name);
        } else {
          names = lines
            .map((line) => line.split(",")[0].trim())
            .filter((name) => name);
        }

        if (names.length === 0) {
          Swal.fire({
            title: "CSV vacío o inválido.",
            text: "El archivo CSV no contiene nombres válidos en la primera columna.",
            icon: "error",
            confirmButtonText: "Ok",
          });
          setIsLoading(false);
          return;
        }

        
        Swal.fire({
          title: "CSV subido con éxito.",
          text: `${names.length} asistentes cargados correctamente.`,
          icon: "success",
          confirmButtonColor: "#E0B625",
        });
        loadAttendees(names, { group: "Votacion nominal" });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        Swal.fire({
          title: "Error al procesar el CSV.",
          text: "No se pudo procesar el archivo CSV.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      Swal.fire({
        title: "Error al leer el archivo.",
        text: "No se pudo leer el archivo seleccionado.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <section className="flex items-stretch justify-center gap-12">
        {/*Logo UNMSM */}
        <div className="flex justify-center items-center">
          <Image
            src="UNMSM_Transparente.svg"
            width={348}
            height={348}
            alt="Logo UNMSM"
          />
        </div>

        {/* Tarjeta de subir archivo CSV */}
        <Card className="w-full max-w-md shadow-lg rounded-xl flex flex-col justify-center items-center">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Subir lista de asistencia
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Subir archivo */}
            <div className="space-y-2">
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer file:text-black bg-(--bg-dorado)/10 text-black placeholder:text-black/60 focus-visible:ring-(--bg-dorado)/80 border-(--bg-dorado)/50"
                aria-label="Subir archivo CSV"
              />
              <p className="text-xs text-left text-muted-foreground pl-2">
                El archivo debe ser formato .csv
              </p>
            </div>

            <Button
              variant={"default"}
              onClick={handleFileUpload}
              disabled={isLoading || !file}
              className="w-full cursor-pointer bg-(--bg-dorado) text-black hover:bg-(--bg-dorado)/80"
            >
              <Upload className="mr-2 h-5 w-5" />
              {isLoading ? "Procesando..." : "Subir e Iniciar"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
