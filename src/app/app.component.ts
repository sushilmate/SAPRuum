import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'SAPRuum';
  public timeIntervals: Interval[] = [];
  public events: CalenderEvent[] = [];

  constructor(public zone: NgZone) {
    // global event layoutday can be trigger through website console.
    window['layOutDay'] = this.layOutDay.bind(this);
  }

  ngOnInit(): void {
    this.initializeIntervals();
    // default events on calender as per spec.
    this.layOutDay([{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }]);
  }

  public layOutDay(calederEvent: Event[]) {
    // running in the zone to update view from outside the context or through global event as in from browser.
    this.zone.run(() => {

      // base for events to be in multiple of, currently base 10 & we can just increase or decrease value to accomodate
      // more closer event or far events.
      let base = 10;

      //reset the calender control
      this.events = [];

      // initialize the events
      for (var i = 0; i < 70; i++) {
        this.events.push(new CalenderEvent(false, [], 100, [], false));
      }

      if (calederEvent == null || !Array.isArray(calederEvent))
        return;

      // traversing through every calender event to render on UI.
      calederEvent.forEach((event) => {

        let colsToSpan = 1;
        let colsToDivide = 100;
        let eventToShow = this.events[event.start / base];

        eventToShow.show = true;
        eventToShow.rowSpans.push((event.end - event.start) / base);

        for (var i = 0; i < calederEvent.length; i++) {
          let calEvent = calederEvent[i];

          // same event or already visited.
          if (event == calEvent || eventToShow.visited)
            continue;

          if ((event.start <= calEvent.start && event.end >= calEvent.start) ||
            (event.start <= calEvent.end && event.end >= calEvent.end) ||
            (event.start >= calEvent.start && event.end <= calEvent.end)) {
            if (this.events[calEvent.start / base].visited) {
              // already calculated so dont need to calculate again.
              colsToDivide -= this.events[calederEvent[i].start / base].colSpans;
            }
            else {
              colsToSpan++;// increase the cols to span on calender
              eventToShow.collidedEvents.push(this.events[calederEvent[i].start / base]);
            }
          }
        }

        if (!eventToShow.visited) {
          let colSpan = colsToDivide / colsToSpan;

          eventToShow.colSpans = colSpan;
          eventToShow.visited = true;

          // only make changes to those not yet visited.
          eventToShow.collidedEvents.filter(x => !x.visited).forEach((event) => {
            event.colSpans = colSpan;
            event.visited = true;
          });
        }

        // we are not showing the event which are not in scope.
        var sliced = this.events.slice(event.start / base + 1, ((event.end - event.start) / base));
        sliced.forEach((slicedEvent) => {
          slicedEvent.show = null;
        });
      });
    });
  }

  private initializeIntervals() {
    this.timeIntervals.push(new Interval("9.00", "AM"), new Interval("", "9.30")
      , new Interval("10.00", "AM"), new Interval("", "10.30")
      , new Interval("11.00", "AM"), new Interval("", "11.30")
      , new Interval("12.00", "PM"), new Interval("", "12.30")
      , new Interval("1.00", "PM"), new Interval("", "1.30")
      , new Interval("2.00", "PM"), new Interval("", "2.30")
      , new Interval("3.00", "PM"), new Interval("", "3.30")
      , new Interval("4.00", "PM"), new Interval("", "4.30")
      , new Interval("5.00", "PM"), new Interval("", "5.30")
      , new Interval("6.00", "PM"), new Interval("", "6.30")
      , new Interval("7.00", "PM"), new Interval("", "7.30")
      , new Interval("8.00", "PM"));
  }
}

export class Interval {
  constructor(public time: string, public zoneOrHalfTime: string) {
  }
}

export class Event {
  constructor(public start: number, public end: number) {
  }
}

export class CalenderEvent {
  constructor(public show: boolean, public rowSpans: number[], public colSpans: number,
    public collidedEvents: CalenderEvent[], public visited: boolean) {
  }
}
