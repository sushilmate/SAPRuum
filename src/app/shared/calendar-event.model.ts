
export class CalendarEvent {
  constructor(public show: boolean, public rowSpans: number[], public colSpans: number,
    public visited: boolean, public startColIndex: number, public intersectEvents: CalendarEvent[]) {
  }
}
