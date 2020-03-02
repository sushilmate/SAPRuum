
export class CalendarEvent {
  constructor(public show: boolean, public rowSpans: number[], public colSpans: number,
    public collidedEvents: CalendarEvent[], public visited: boolean) {
  }
}
