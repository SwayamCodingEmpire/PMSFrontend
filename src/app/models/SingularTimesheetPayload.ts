import { DayWiseTimesheet } from "./DayWiseTimesheet";

export interface SingularTimesheetPayload {
  date: Date; // Array of project time sheets
  dayTimeSheet: DayWiseTimesheet[]; // Hours worked on the given date
}
