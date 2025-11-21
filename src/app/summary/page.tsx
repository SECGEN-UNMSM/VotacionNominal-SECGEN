"use client";

import { useAttendance } from "@/contexts/attendance-context";
import AttendanceReport from "@/components/attendance-report";
import ExportButton from "@/components/export-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function SummaryPage() {
  const { attendees, resetAttendance } = useAttendance();
  const router = useRouter();

  const handleStartNew = () => {
    resetAttendance();
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Button
        onClick={() => router.push("/")}
        className="mb-6 bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Regresar a la Lista de Asistencia
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-card-foreground">
            Reporte de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendees.length > 0 ? (
            <AttendanceReport attendees={attendees} />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay datos de asistencia disponibles. Por favor, comienza
              subiendo un CSV.
            </p>
          )}
        </CardContent>
        {attendees.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t">
            <ExportButton attendees={attendees} />
            <Button
              onClick={handleStartNew}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <RotateCcw className="mr-2 h-5 w-5" /> Empezar una nueva sesión
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
