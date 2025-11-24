"use client";

import React, { useState } from "react";
import { useAttendance } from "@/contexts/attendance-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  SkipBack,
  SkipForward,
  ListChecks,
} from "lucide-react";

export default function AttendanceTaking() {
  const { attendees, updateAttendeeStatus } = useAttendance();
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  /*
  const filteredAttendees = useMemo(() => {
    if (!searchTerm) {
      return attendees;
    }
    return attendees.filter((attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendees, searchTerm]);*/

  const handleNext = () => {
    if (currentIndex < attendees.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentAttendee = attendees[currentIndex];
  const progress =
    attendees.length > 0
      ? (attendees.filter((a) => a.status !== undefined).length /
          attendees.length) *
        100
      : 0;

  /*
  useEffect(() => {
    if (
      currentAttendee &&
      !filteredAttendees.find((a) => a.id === currentAttendee.id) &&
      filteredAttendees.length > 0
    ) {
      // Logic for search interaction (kept as is)
    }
  }, [filteredAttendees, currentAttendee, attendees]);*/

  /*
  const handleAttendeeSelect = (attendeeId: string) => {
    const originalIndex = attendees.findIndex((a) => a.id === attendeeId);
    if (originalIndex !== -1) {
      setCurrentIndex(originalIndex);
    }
  };*/

  const favorCount = attendees.filter((a) => a.status === "in-favor").length;
  const againstCount = attendees.filter((a) => a.status === "against").length;
  const abstainCount = attendees.filter((a) => a.status === "abstain").length;

  if (attendees.length === 0) {
    return <p>No hay asistentes cargados. Por favor, sube un archivo CSV.</p>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6 flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6 grow">
        {/* Tarjeta de votación */}
        <Card className="shadow-xl lg:grow flex flex-col rounded-2xl py-12">
          <CardHeader>
            <Progress
              value={progress}
              className="w-full mt-2 bg-(--bg-dorado)/20"
              aria-label={`${progress.toFixed(0)}% completado`}
            />
            <p className="text-center text-lg text-muted-foreground mt-1">{`Asistente ${
              currentIndex + 1
            } de ${attendees.length}`}</p>
          </CardHeader>
          {currentAttendee && (
            <CardContent className="grow flex flex-col items-center justify-center space-y-8">
              <div className="text-center p-6 bg-(--bg-dorado)/10 w-full h-84 md:h-32 flex justify-center items-center rounded-lg shadow-inner">
                <h2
                  className="font-bold text-black my-2"
                  style={{ fontSize: "var(--attendee-font-size, 48px)" }}
                  data-ai-hint="person name"
                >
                  {currentAttendee.name}
                </h2>
              </div>

              {/* Botones de accion: Anterior o siguiente */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  size="lg"
                  className="select-none bg-(--bg-boton-dorado) hover:bg-(--bg-boton-dorado)/90 cursor-pointer text-accent-foreground transform hover:scale-105 transition-transform h-16 text-xl"
                >
                  <SkipBack className="mr-2 h-7 w-7" /> Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === attendees.length - 1}
                  size="lg"
                  className="select-none bg-(--bg-boton-dorado) cursor-pointer hover:bg-(--bg-boton-dorado)/90 text-accent-foreground transform hover:scale-105 transition-transform h-16 text-xl"
                >
                  Siguiente <SkipForward className="ml-2 h-7 w-7" />
                </Button>
              </div>

              {/* Botones de acción: A favor, En contra o Abstención */}
              <RadioGroup
                key={currentAttendee.id}
                value={currentAttendee.status ?? ""}
                onValueChange={(status) =>
                  updateAttendeeStatus(
                    currentAttendee.id,
                    status as "in-favor" | "against" | "abstain"
                  )
                }
                className="flex flex-col md:grid md:grid-cols-3 justify-center items-center gap-6 py-4"
              >
                <div className="flex flex-1 items-center">
                  <RadioGroupItem
                    value="in-favor"
                    id={`status-in-favor-${currentAttendee.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`status-in-favor-${currentAttendee.id}`}
                    className="flex items-center justify-center w-72 h-24 p-4 border-2 rounded-lg shadow-md cursor-pointer text-2xl font-semibold
                               transition-all duration-150 ease-in-out
                               peer-data-[state=unchecked]:bg-card peer-data-[state=unchecked]:text-card-foreground peer-data-[state=unchecked]:border-border
                               peer-data-[state=checked]:bg-green-800 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-green-900
                               hover:peer-data-[state=unchecked]:bg-green-50 hover:peer-data-[state=unchecked]:border-green-400
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    A favor
                  </Label>
                </div>
                <div className="flex flex-1 items-center gap-4">
                  <RadioGroupItem
                    value="against"
                    id={`status-against-${currentAttendee.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`status-against-${currentAttendee.id}`}
                    className="flex items-center justify-center w-72 h-24 p-4 border-2 rounded-lg shadow-md cursor-pointer text-2xl font-semibold
                               transition-all duration-150 ease-in-out
                               peer-data-[state=unchecked]:bg-card peer-data-[state=unchecked]:text-card-foreground peer-data-[state=unchecked]:border-border
                               peer-data-[state=checked]:bg-red-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-red-700
                               hover:peer-data-[state=unchecked]:bg-red-50 hover:peer-data-[state=unchecked]:border-red-400
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    En contra
                  </Label>
                </div>
                <div className="flex flex-1 items-center">
                  <RadioGroupItem
                    value="abstain"
                    id={`status-abstain-${currentAttendee.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`status-abstain-${currentAttendee.id}`}
                    className="flex items-center justify-center w-72 h-24 p-4 border-2 rounded-lg shadow-md cursor-pointer text-2xl font-semibold
                               transition-all duration-150 ease-in-out
                               peer-data-[state=unchecked]:bg-card peer-data-[state=unchecked]:text-card-foreground peer-data-[state=unchecked]:border-border
                               peer-data-[state=checked]:bg-yellow-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-yellow-700
                               hover:peer-data-[state=unchecked]:bg-red-50 hover:peer-data-[state=unchecked]:border-yellow-400
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Abstencion
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          )}
          <CardFooter className="flex justify-center py-6 pb-9">
            <Button
              variant={"outline"}
              onClick={() => router.push("/summary")}
              className="py-7 text-xl cursor-pointer border-none bg-(--bg-boton-dorado) hover:bg-(--bg-boton-dorado)/80"
            >
              <ListChecks className="mr-1 h-8 w-8" /> Ver Registro
            </Button>
          </CardFooter>
        </Card>

        {/* Tarjeta de Resumen */}
        <Card className="shadow-xl lg:w-full lg:max-w-xs xl:max-w-sm flex flex-col rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-5xl text-center text-black">
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="grow flex flex-col space-y-6 pt-4">
            <div className="flex items-center justify-between p-4 bg-(--bg-dorado)/10 rounded-lg">
              <span className="text-2xl md:text-3xl font-medium">A favor:</span>
              <span
                className="text-2xl md:text-4xl font-bold text-green-800"
                style={{ fontSize: "var(--attendee-font-size, 32px)" }}
              >
                {favorCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--bg-dorado)/10 rounded-lg">
              <span className="text-2xl md:text-3xl font-medium">
                En contra:
              </span>
              <span
                className="text-2xl md:text-3xl font-bold text-red-600"
                style={{ fontSize: "var(--attendee-font-size, 32px)" }}
              >
                {againstCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--bg-dorado)/10 rounded-lg">
              <span className="text-2xl md:text-3xl font-medium">
                Abstención:
              </span>
              <span
                className="text-2xl md:text-3xl font-bold text-yellow-600"
                style={{ fontSize: "var(--attendee-font-size, 32px)" }}
              >
                {abstainCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--bg-dorado)/10 rounded-lg">
              <span className="text-2xl md:text-3xl font-medium" >Total:</span>
              <span
                className="text-2xl md:text-3xl font-bold text-primary"
                style={{ fontSize: "var(--attendee-font-size, 32px)" }}
              >
                {attendees.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
