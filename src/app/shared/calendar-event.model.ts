
export class CalendarEvent {
  constructor(public show: boolean, public start: number, public end: number, public rowSpans: number[], public colSpans: number,
    public visited: boolean, public startColIndex: number, public intersectEvents: CalendarEvent[]) {
  }
}
