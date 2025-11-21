"use client";
import Link from "next/link";
import { ClipboardCheck, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/contexts/settings-context";

export default function AppHeader() {
  const { fontSize, setFontSize, minSize, maxSize } = useSettings();

  return (
    <header
      className="sticky top-0 z-50 w-full flex justify-center items-center border-b bg-primary shadow-sm"
      style={{ height: "var(--header-height, 4rem)" }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          <ClipboardCheck className="h-7 w-7" />
          <span className="text-2xl font-bold">Control de Asistencia</span>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-full text-primary-foreground hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary">
              <Settings className="h-6 w-6" />
              <span className="sr-only">Abrir configuración</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 mr-4" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-card-foreground">
                  Configuración
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ajusta las opciones de accesibilidad.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="space-y-4">
                  <Label htmlFor="text-size-slider">Tamaño de Texto</Label>
                  <Slider
                    id="text-size-slider"
                    min={minSize}
                    max={maxSize}
                    step={1}
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pequeño</span>
                    <span>Grande</span>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
