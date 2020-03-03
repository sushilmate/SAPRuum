import { Component, OnInit, NgZone } from '@angular/core';

import { Interval } from './shared/interval.model';
import { CalendarEvent } from './shared/calendar-event.model';
import { Event } from './shared/event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'SAPRuum';
  public timeIntervals: Interval[] = [];
  public events: CalendarEvent[] = [];

  constructor(public zone: NgZone) {
    // global event layoutday can be trigger through website console.
    window['layOutDay'] = this.layOutDay.bind(this);
  }

  ngOnInit(): void {
    this.initializeIntervals();
    // default events on calender as per spec.
    this.layOutDay([{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }]);
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

  public layOutDay(calederEvent: Event[]) {
    // running in the zone to update view from outside the context or through global event as in from browser.
    this.zone.run(() => {

      // base for events to be in multiple of, currently base 10 & we can just increase or decrease value to accomodate
      // more closer event or far events.
      let base = 10;

      //reset the calender control
      this.events = [];

      this.initializeEvents(base);

      if (calederEvent == null || !Array.isArray(calederEvent))
        return;

      // traversing through every calender event to render on UI.
      calederEvent.forEach((event) => {

        let interesctEventsCount = 1;
        let availableCols = 100;
        let eventToShow = this.events[event.start / base];

        eventToShow.show = true;
        eventToShow.rowSpans.push((event.end - event.start) / base);

        for (var i = 0; i < calederEvent.length; i++) {
          let calEvent = calederEvent[i];

          // same event or already visited.
          if (event == calEvent || eventToShow.visited)
            continue;

          if (this.isEventsInterSecting(event, calEvent)) {
            if (this.events[calEvent.start / base].visited) {
              // already calculated so dont need to calculate again.
              // and we will choose min space available.
              availableCols = Math.min(availableCols, this.events[calederEvent[i].start / base].startColumnPosition);
            }
            else {
              interesctEventsCount++;// increase the cols to span on calender
              eventToShow.collidedEvents.push(this.events[calederEvent[i].start / base]);
            }
          }
        }

        if (!eventToShow.visited) {
          let colSpanLength = availableCols / interesctEventsCount;

          eventToShow.colSpans = colSpanLength;
          eventToShow.visited = true;

          // we need to track the rendered col position with the event.
          let eventFirstColPosition = colSpanLength;
          // only make changes to those not yet visited.
          eventToShow.collidedEvents.filter(x => !x.visited).forEach((event) => {
            event.colSpans = colSpanLength;
            event.visited = true;
            event.startColumnPosition = eventFirstColPosition;
            eventFirstColPosition += colSpanLength;
          });
        }
        // we are not showing the event which are not in scope.
        this.removeNonScopedEvents(event, base);
      });
    });
  }
  initializeEvents(base: number) {
    // initialize the events, 12 is 9 AM to 9 PM hours multiply by hours & divide by our base.
    let numberOfEvents = (12 * 60 / base);
    for (var i = 0; i < numberOfEvents; i++) {
      this.events.push(new CalendarEvent(false, [], 100, [], false, 0));
    }
  }

  private isEventsInterSecting(event: Event, calEvent: Event): boolean {
    return (event.start <= calEvent.start && event.end >= calEvent.start) ||
      (event.start <= calEvent.end && event.end >= calEvent.end) ||
      (event.start >= calEvent.start && event.end <= calEvent.end)
  }

  private removeNonScopedEvents(event: Event, base: number) {
    var sliced = this.events.slice(event.start / base + 1, ((event.end - event.start) / base));
    sliced.forEach((slicedEvent) => {
      slicedEvent.show = null;
    });
  }
}
