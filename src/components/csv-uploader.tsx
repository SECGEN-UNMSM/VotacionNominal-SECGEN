"use client";

import type { ChangeEvent } from "react";
import React, { useState } from "react";
import {
  useAttendance,
  type SessionGroup,
  type SessionMeeting,
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
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CsvUploader() {
  const { loadAttendees } = useAttendance();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionGroup, setSessionGroup] = useState<SessionGroup | null>(null);
  const [sessionMeeting, setSessionMeeting] = useState<SessionMeeting | null>(
    null
  );
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSessionGroupSelect = (group: SessionGroup) => {
    setSessionGroup(group);
    setSessionMeeting(null); // Reset meeting selection when group changes
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No se seleccionó ningún archivo",
        description: "Por favor, selecciona un archivo CSV para subir.",
        variant: "destructive",
      });
      return;
    }
    if (!sessionGroup || !sessionMeeting) {
      toast({
        title: "Selección de sesión incompleta",
        description: "Por favor, elige el tipo y la modalidad de la sesión.",
        variant: "destructive",
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
          toast({
            title: "CSV vacío o inválido",
            description:
              "El archivo CSV no contiene nombres válidos en la primera columna.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        loadAttendees(names, { group: sessionGroup, meeting: sessionMeeting });
        toast({
          title: "CSV subido con éxito",
          description: `${names.length} asistentes cargados correctamente.`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error al procesar el CSV",
          description:
            "No se pudo procesar el archivo CSV. Asegúrate de que sea un CSV válido.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error al leer el archivo",
        description: "No se pudo leer el archivo seleccionado.",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-row items-stretch justify-center gap-8 space-x-4">
      <div className="flex justify-center items-center gap-16">
        <Image
          src="UNMSM_Transparente.svg"
          width={360}
          height={360}
          alt="Logo UNMSM"
        />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Subir Lista de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-left">
            <h3 className="text-sm font-bold text-black">
              Seleccione el tipo de reunión:
            </h3>
            <div className="flex justify-start gap-4">
              <Button
                onClick={() => handleSessionGroupSelect("Consejo")}
                variant={sessionGroup === "Consejo" ? "default" : "outline"}
                className={`flex-1 ${
                  sessionGroup === "Consejo"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10"
                }`}
              >
                Consejo
              </Button>
              <Button
                onClick={() => handleSessionGroupSelect("Asamblea")}
                variant={sessionGroup === "Asamblea" ? "default" : "outline"}
                className={`flex-1 ${
                  sessionGroup === "Asamblea"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10"
                }`}
              >
                Asamblea
              </Button>
            </div>

            {sessionGroup && (
              <div className="space-y-3">
                <h3 className="text-sm text-black pt-2">
                  Seleccione el tipo de sesión:
                </h3>
                <div className="flex justify-start gap-4">
                  <Button
                    onClick={() => setSessionMeeting("Ordinaria")}
                    variant={
                      sessionMeeting === "Ordinaria" ? "default" : "outline"
                    }
                    className={`flex-1 ${
                      sessionMeeting === "Ordinaria"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary/10"
                    }`}
                  >
                    Ordinaria
                  </Button>
                  <Button
                    onClick={() => setSessionMeeting("Extraordinaria")}
                    variant={
                      sessionMeeting === "Extraordinaria"
                        ? "default"
                        : "outline"
                    }
                    className={`flex-1 ${
                      sessionMeeting === "Extraordinaria"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary/10"
                    }`}
                  >
                    Extraordinaria
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file:text-black bg-primary/10 text-black placeholder:text-black/60 focus-visible:ring-primary/80 border-black/30"
              aria-label="Upload CSV file"
            />
            <p className="text-xs text-left text-muted-foreground">
              El archivo debe ser formato .csv
            </p>
          </div>
          <Button
            onClick={handleFileUpload}
            disabled={isLoading || !file || !sessionGroup || !sessionMeeting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Upload className="mr-2 h-5 w-5" />
            {isLoading ? "Procesando..." : "Subir e Iniciar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
