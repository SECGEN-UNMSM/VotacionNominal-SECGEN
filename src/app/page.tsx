
"use client";

import CsvUploader from '@/components/csv-uploader';
import AttendanceTaking from '@/components/attendance-taking';
import { useAttendance } from '@/contexts/attendance-context';

export default function HomePage() {
  const { attendees } = useAttendance();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,4rem)-2rem)] p-4">
      {attendees.length === 0 ? <CsvUploader /> : <AttendanceTaking />}
    </div>
  );
}
