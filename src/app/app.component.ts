import { Component, OnInit, NgZone } from '@angular/core';

import { Interval } from './shared/interval.model';
import { CalendarEvent } from './shared/calendar-event.model';
import { Event } from './shared/event.model';
import { ColumnDetails } from './shared/column-details.model';

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
    //this.layOutDay([{ start: 50, end: 170 }, { start: 200, end: 350 }, { start: 250, end: 450 }, { start: 280, end: 370 }, { start: 380, end: 570 }, { start: 460, end: 570 }]);
    //this.layOutDay([{ start: 100, end: 300 }, { start: 150, end: 400 }, { start: 200, end: 600 }, { start: 310, end: 800 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 150 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 180, end: 260 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 100 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 90, end: 250 }, { start: 100, end: 400 }, { start: 110, end: 500 }, { start: 120, end: 500 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 70, end: 120 }, { start: 90, end: 250 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 90, end: 250 }, { start: 200, end: 300 }, { start: 220, end: 330 }]);
    //this.layOutDay([{ start: 10, end: 150 }, { start: 240, end: 600 }, { start: 360, end: 620 }, { start: 610, end: 670 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 180, end: 500 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 130, end: 180 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 130, end: 180 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }, { start: 330, end: 470 }]);
    //this.layOutDay([{ start: 100, end: 400 }, { start: 110, end: 400 }, { start: 150, end: 200 }, { start: 250, end: 400 }]);
    //this.layOutDay([{ start: 100, end: 400 }, { start: 110, end: 190 }, { start: 120, end: 400 }, { start: 250, end: 400 }]);
    //this.layOutDay([{ start: 100, end: 400 }, { start: 110, end: 150 }, { start: 120, end: 150 }, { start: 130, end: 150 }, { start: 200, end: 400 }]);
    //this.layOutDay([{ start: 100, end: 400 }, { start: 110, end: 150 }, { start: 120, end: 150 }, { start: 130, end: 150 }, { start: 160, end: 250 }, { start: 170, end: 250 }, { start: 260, end: 400 }]);
    //this.layOutDay([{ start: 100, end: 500 }, { start: 110, end: 150 }, { start: 120, end: 250 }, { start: 150, end: 390 }]);
    //this.layOutDay([{ start: 100, end: 500 }, { start: 110, end: 150 }, { start: 120, end: 400 }, { start: 150, end: 200 }, { start: 130, end: 500 }, { start: 410, end: 500 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 110, end: 210 }, { start: 150, end: 190 }, { start: 200, end: 300 }, { start: 220, end: 320 }, { start: 310, end: 360 }, { start: 320, end: 400 }, { start: 330, end: 550 }, { start: 370, end: 550 }, { start: 410, end: 550 }]);
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

  private initializeEvents(base: number): void {
    // initialize the events, 12 is 9 AM to 9 PM hours multiply by hours & divide by our base.
    let numberOfEvents = (12 * 60 / base);
    for (var i = 0; i < numberOfEvents; i++) {
      this.events.push(new CalendarEvent(false, 0, 0, [], 100, false, 0, []));
    }
  }

  public layOutDay(inputEvents: Event[]) {
    // running in the zone to update view from outside the context or through global event as in from browser.
    this.zone.run(() => {

      // base for events to be in multiple of, currently base 10 & we can just increase or decrease value to accomodate
      // more closer event or far events.
      let base = 10;

      //reset the calender control
      this.events = [];

      this.initializeEvents(base);

      if (inputEvents == null || !Array.isArray(inputEvents))
        return;

      // traversing through every calender event to render on UI.
      inputEvents.forEach((currentEvent) => {

        let eventToShow = this.events[currentEvent.start / base];
        eventToShow.start = currentEvent.start;
        eventToShow.end = currentEvent.end;
        eventToShow.show = true;
        eventToShow.rowSpans.push((currentEvent.end - currentEvent.start) / base);

        for (var i = 0; i < inputEvents.length; i++) {

          let calEvent = inputEvents[i];

          // same event.
          if (currentEvent == calEvent) {
            continue;
          }

          if (this.isEventsInterSecting(currentEvent, calEvent)) {
            let interSectEvent = this.events[calEvent.start / base];
            eventToShow.intersectEvents.push(interSectEvent);
          }
        }
      });

      // Calcuate the colspan for event event.
      for (var i = 0; i < inputEvents.length; i++) {

        let currentEventOnCalendar = this.events[inputEvents[i].start / base];

        if (currentEventOnCalendar.visited || currentEventOnCalendar.intersectEvents.length == 0)
          continue;

        // logic is divided into two parts, first part is when we get starting main event in the calendar
        if (currentEventOnCalendar.intersectEvents.every(x => !x.visited)) {
          // fresh lot found
          this.applySameColSpanToEveryIntersectEvents(currentEventOnCalendar);
        }
        else {
          // second part the subsequent events they might collide with above events.
          this.calculateAndApplyColSpan(currentEventOnCalendar);
        }
      }
    });
  }

  private isEventsInterSecting(event: Event, calEvent: Event): boolean {
    return (event.start <= calEvent.start && event.end >= calEvent.start) ||
      (event.start < calEvent.end && event.end >= calEvent.end) ||
      (event.start >= calEvent.start && event.end <= calEvent.end)
  }

  private calculateAndApplyColSpan(currentEventOnCalendar: CalendarEvent): void {

    let visitedIntersectEvents = currentEventOnCalendar.intersectEvents.filter(x => x.visited);

    let newIntersectEvents = currentEventOnCalendar.intersectEvents.filter(x => !x.visited);

    let colsToDivide = 1;

    let vacantPositions = this.calculateAvailableCols(visitedIntersectEvents);

    for (var i = 0; i < newIntersectEvents.length; i++) {

      let foundVacentPosition = false;

      for (var j = 0; j < visitedIntersectEvents.length; j++) {

        if (!newIntersectEvents[i].intersectEvents.includes(visitedIntersectEvents[j])) {
          foundVacentPosition = true;
          break;
        }
      }
      if (!foundVacentPosition)
        colsToDivide++;
    }
    // new intersect event with current event thats why + 1
    if (vacantPositions.length >= (newIntersectEvents.length + 1)) {
      colsToDivide = 1;
    }

    let maxColSpan = Math.ceil(vacantPositions[0].availableCol / colsToDivide);

    currentEventOnCalendar.colSpans = maxColSpan;
    currentEventOnCalendar.startColIndex = vacantPositions[0].startColIndex;
    currentEventOnCalendar.visited = true;
  }

  private calculateAvailableCols(intersectedEvents: CalendarEvent[]): ColumnDetails[] {

    let availableCols: ColumnDetails[] = [];

    if (intersectedEvents.some(x => x.startColIndex == 0)) {

      if (intersectedEvents.length == 1) {
        availableCols.push(new ColumnDetails(intersectedEvents[0].colSpans, (100 - intersectedEvents[0].colSpans)));
        return availableCols;
      }

      let sortedEventsByStartColIndex = intersectedEvents.sort((a, b) => a.startColIndex - b.startColIndex);

      let startPos = sortedEventsByStartColIndex[0].colSpans;

      for (var i = 1; i < sortedEventsByStartColIndex.length; i++) {
        let currentSortedEvent = sortedEventsByStartColIndex[i];

        if (currentSortedEvent.startColIndex <= startPos) {
          startPos = currentSortedEvent.startColIndex + currentSortedEvent.colSpans;
          continue;
        }

        availableCols.push(new ColumnDetails(startPos, (currentSortedEvent.startColIndex - startPos)));
        startPos = currentSortedEvent.startColIndex + currentSortedEvent.colSpans;
      }

      // check if we reached end or not, there might some space available if events occured in between
      if (startPos < 99) {
        availableCols.push(new ColumnDetails(startPos, (100 - startPos)));
      }
    }
    else {
      availableCols.push(new ColumnDetails(0, intersectedEvents[0].startColIndex));

      let end = intersectedEvents[0].startColIndex + intersectedEvents[0].colSpans;

      for (var i = 1; i < intersectedEvents.length; i++) {
        let currentEvent = intersectedEvents[i];

        availableCols.push(new ColumnDetails(end, currentEvent.startColIndex - end));
        end = currentEvent.startColIndex + currentEvent.colSpans;
      }
      // check if we reached end or not, there might some space available if events occured in between
      if (end < 99) {
        availableCols.push(new ColumnDetails(end, 100 - end));
      }
    }
    return availableCols;
  }

  private applySameColSpanToEveryIntersectEvents(currentEventOnCalendar: CalendarEvent): void {

    let eventsToShareSpaceWithMainEvent: CalendarEvent[] = [];

    // this is find if some events comes after any other events which collides with main event.
    // we dont have calculate space for them as they might fit below 
    for (var i = 0; i < currentEventOnCalendar.intersectEvents.length; i++) {
      if (currentEventOnCalendar.intersectEvents.some(x => x.end <= currentEventOnCalendar.intersectEvents[i].start)) {
        continue;
      }
      else {
        eventsToShareSpaceWithMainEvent.push(currentEventOnCalendar.intersectEvents[i]);
      }
    }

    let colSpanSize = Math.ceil((100 / (eventsToShareSpaceWithMainEvent.length + 1)));

    currentEventOnCalendar.colSpans = colSpanSize;
    currentEventOnCalendar.visited = true;
    currentEventOnCalendar.startColIndex = 0;

    let startColIndexCounter = colSpanSize;

    // this events are the ones who is directly colliding with main event & has someone below them
    eventsToShareSpaceWithMainEvent.forEach((event) => {
      event.colSpans = colSpanSize;
      event.startColIndex = startColIndexCounter;
      event.visited = true;
      startColIndexCounter += colSpanSize;
    });
  }
}
