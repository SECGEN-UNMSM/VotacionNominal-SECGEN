"use client";

import type { Attendee } from "@/contexts/attendance-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  CalendarDays,
  ChartNoAxesColumn,
} from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface AttendanceReportProps {
  attendees: Attendee[];
}

export default function AttendanceReport({ attendees }: AttendanceReportProps) {
  const favorAttendees = attendees.filter((a) => a.status === "in-favor");
  const againstAttendees = attendees.filter((a) => a.status === "against");
  const abstainAttendees = attendees.filter((a) => a.status === "abstain");
  const summaryDate = new Date().toLocaleDateString();

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="shadow-md md:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            Resumen General
          </CardTitle>
          <ChartNoAxesColumn className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <CalendarDays className="inline-block mr-2 h-4 w-4" />
                  Fecha
                </TableCell>
                <TableCell className="text-right">{summaryDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <Users className="inline-block mr-2 h-4 w-4" />
                  Total de Participantes
                </TableCell>
                <TableCell className="text-right">{attendees.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 w-full">
        {/* Tarjeta de la sección a favor. */}
        <Card className="shadow-md flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">A favor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-900">
              {favorAttendees.length}
            </div>
            <p className="text-xs text-muted-foreground">
              de un total de {attendees.length} participantes
            </p>
            <ScrollArea className="h-[200px] mt-4 pr-3">
              {favorAttendees.length > 0 ? (
                <ul className="space-y-1">
                  {favorAttendees.map((attendee) => (
                    <li
                      key={attendee.id}
                      className="text-sm p-2 rounded-md border"
                      data-ai-hint="person name"
                    >
                      {attendee.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Ningún participante votó a favor.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tarjeta de la sección en contra */}
        <Card className="shadow-md flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">En contra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">
              {againstAttendees.length}
            </div>
            <p className="text-xs text-muted-foreground">
              de un total de {attendees.length} participantes
            </p>
            <ScrollArea className="h-[200px] mt-4 pr-3">
              {againstAttendees.length > 0 ? (
                <ul className="space-y-1">
                  {againstAttendees.map((attendee) => (
                    <li
                      key={attendee.id}
                      className="text-sm p-2 rounded-md border"
                      data-ai-hint="person name"
                    >
                      {attendee.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Ningún participante votó en contra.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tarjeta de la sección de asbtención */}
        <Card className="shadow-md flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Abstención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">
              {abstainAttendees.length}
            </div>
            <p className="text-xs text-muted-foreground">
              de un total de {attendees.length} participantes
            </p>
            <ScrollArea className="h-[200px] mt-4 pr-3">
              {abstainAttendees.length > 0 ? (
                <ul className="space-y-1">
                  {abstainAttendees.map((attendee) => (
                    <li
                      key={attendee.id}
                      className="text-sm p-2 rounded-md border"
                      data-ai-hint="person name"
                    >
                      {attendee.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Ningún participante votó en abstención.
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
