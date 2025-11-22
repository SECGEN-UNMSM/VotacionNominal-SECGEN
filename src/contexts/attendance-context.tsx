"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface Attendee {
  id: string;
  name: string;
  status?: "in-favor" | "against" | "abstain";
}

export type SessionGroup = "Votacion nominal";

export interface SessionType {
  group: SessionGroup;
}

/* present: in-favor | absent: against | unmarked: abstain */

interface AttendanceContextType {
  attendees: Attendee[];
  loadAttendees: (names: string[], sessionType: SessionType) => void;
  updateAttendeeStatus: (
    id: string,
    status: "in-favor" | "against" | "abstain"
  ) => void;
  resetAttendance: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "attendance_session_data";

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const { attendees: savedAttendees, sessionType: savedSessionType } =
          JSON.parse(savedData);
        if (savedAttendees && savedSessionType) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAttendees(savedAttendees);
          setSessionType(savedSessionType);
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (attendees.length > 0 && sessionType) {
        const dataToSave = JSON.stringify({ attendees, sessionType });
        localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [attendees, sessionType, isLoaded]);

  const loadAttendees = useCallback((names: string[], session: SessionType) => {
    const newAttendees = names.map((name) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
    }));
    setAttendees(newAttendees);
    setSessionType(session);
  }, []);

  const updateAttendeeStatus = useCallback(
    (id: string, status: "in-favor" | "against" | "abstain") => {
      setAttendees((prevAttendees) =>
        prevAttendees.map((attendee) =>
          attendee.id === id ? { ...attendee, status } : attendee
        )
      );
    },
    []
  );

  const resetAttendance = useCallback(() => {
    setAttendees([]);
    setSessionType(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear state from localStorage", error);
    }
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        attendees,
        loadAttendees,
        updateAttendeeStatus,
        resetAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
