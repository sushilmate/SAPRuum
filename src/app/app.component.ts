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
    //this.layOutDay([{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }]);
    //this.layOutDay([{ start: 50, end: 170 }, { start: 200, end: 350 }, { start: 250, end: 450 }, { start: 280, end: 370 }, { start: 380, end: 570 }, { start: 460, end: 570 }]);
    //this.layOutDay([{ start: 100, end: 300 }, { start: 150, end: 400 }, { start: 200, end: 600 }, { start: 310, end: 800 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 30, end: 150 }]);
    this.layOutDay([{ start: 30, end: 150 }, { start: 30, end: 150 }, { start: 30, end: 150 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 30, end: 150 }, { start: 30, end: 150 }, { start: 30, end: 150 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 150 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 180, end: 260 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 100 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 90, end: 250 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 70, end: 120 }, { start: 90, end: 250 }]);
    //this.layOutDay([{ start: 30, end: 150 }, { start: 60, end: 180 }, { start: 90, end: 250 }, { start: 200, end: 300 }, { start: 220, end: 330 }]);

    //this.layOutDay([{ start: 10, end: 150 }, { start: 240, end: 600 }, { start: 360, end: 620 }, { start: 610, end: 670 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 180, end: 500 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 130, end: 180 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }]);
    //this.layOutDay([{ start: 100, end: 200 }, { start: 120, end: 300 }, { start: 130, end: 180 }, { start: 220, end: 400 }, { start: 230, end: 400 }, { start: 310, end: 470 }, { start: 330, end: 470 }]);
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

  public layOutDay(calenderEvent: Event[]) {
    // running in the zone to update view from outside the context or through global event as in from browser.
    this.zone.run(() => {

      // base for events to be in multiple of, currently base 10 & we can just increase or decrease value to accomodate
      // more closer event or far events.
      let base = 10;

      //reset the calender control
      this.events = [];

      this.initializeEvents(base);

      if (calenderEvent == null || !Array.isArray(calenderEvent))
        return;

      // traversing through every calender event to render on UI.
      calenderEvent.forEach((currentEvent) => {

        let eventToShow = this.events[currentEvent.start / base];
        eventToShow.show = true;
        eventToShow.rowSpans.push((currentEvent.end - currentEvent.start) / base);

        for (var i = 0; i < calenderEvent.length; i++) {

          let calEvent = calenderEvent[i];

          // same event.
          if (currentEvent == calEvent) {
            continue;
          }

          if (this.isEventsInterSecting(currentEvent, calEvent)) {
            let interSectEvent = this.events[calEvent.start / base];
            if (!eventToShow.intersectEvents.includes(interSectEvent))
              eventToShow.intersectEvents.push(interSectEvent);
          }
        }
      });

      // Calcuate the colspan for event event.
      for (var i = 0; i < calenderEvent.length; i++) {

        let currentEventOnCalender = this.events[calenderEvent[i].start / base];

        if (currentEventOnCalender.visited || currentEventOnCalender.intersectEvents.length == 0)
          continue;

        if (currentEventOnCalender.intersectEvents.every(x => !x.visited)) {
          // fresh lot found
          this.applySameColSpanToEveryIntersectEvents(currentEventOnCalender);
        }
        else {
          this.calculateAndApplyColSpan(currentEventOnCalender);
        }
      }
    });
  }

  private calculateAndApplyColSpan(currentEventOnCalender: CalendarEvent): void {

    let visitedIntersectEvents = currentEventOnCalender.intersectEvents.filter(x => x.visited);

    let newintersectEvents = currentEventOnCalender.intersectEvents.filter(x => !x.visited);

    let colsToDivide = 1;

    let vacentPositions = this.calculateAvailableCols(visitedIntersectEvents);

    for (var i = 0; i < newintersectEvents.length; i++) {

      let foundVacentPosition = false;

      for (var j = 0; j < visitedIntersectEvents.length; j++) {

        if (!newintersectEvents[i].intersectEvents.includes(visitedIntersectEvents[j])) {
          foundVacentPosition = true;
          break;
        }
      }
      if (!foundVacentPosition)
        colsToDivide++;
    }
    // new intersect event with current event thats why + 1
    if (vacentPositions.length >= (newintersectEvents.length + 1)) {
      colsToDivide = 1;
    }

    let maxColSpan = vacentPositions[0].availableCol / colsToDivide;

    currentEventOnCalender.colSpans = maxColSpan;
    currentEventOnCalender.startColIndex = vacentPositions[0].startColIndex;
    currentEventOnCalender.visited = true;
    //alert(maxColSpan + " " + vacentPositions[0].startColIndex);
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

      for (var i = 0; i < sortedEventsByStartColIndex.length; i++) {

        if (sortedEventsByStartColIndex[i].startColIndex == 0)
          continue;

        if (sortedEventsByStartColIndex[i].startColIndex <= startPos) {
          startPos = sortedEventsByStartColIndex[i].startColIndex + sortedEventsByStartColIndex[i].colSpans;
          continue;
        }
        availableCols.push(new ColumnDetails(startPos, (sortedEventsByStartColIndex[i].startColIndex - startPos)));
        startPos = sortedEventsByStartColIndex[i].startColIndex + sortedEventsByStartColIndex[i].colSpans;
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

        availableCols.push(new ColumnDetails(end, intersectedEvents[i].startColIndex - end));
        end = intersectedEvents[i].startColIndex + intersectedEvents[i].colSpans;
      }
      // check if we reached end or not, there might some space available if events occured in between
      if (end < 99) {
        availableCols.push(new ColumnDetails(end, 100 - end));
      }
    }
    return availableCols;
  }

  private initializeEvents(base: number): void {
    // initialize the events, 12 is 9 AM to 9 PM hours multiply by hours & divide by our base.
    let numberOfEvents = (12 * 60 / base);
    for (var i = 0; i < numberOfEvents; i++) {
      this.events.push(new CalendarEvent(false, [], 100, false, 0, []));
    }
  }

  private isEventsInterSecting(event: Event, calEvent: Event): boolean {
    return (event.start <= calEvent.start && event.end >= calEvent.start) ||
      (event.start <= calEvent.end && event.end >= calEvent.end) ||
      (event.start >= calEvent.start && event.end <= calEvent.end)
  }

  private removeNonScopedEvents(event: Event, base: number): void {
    var sliced = this.events.slice(event.start / base + 1, ((event.end - event.start) / base));
    sliced.forEach((slicedEvent) => {
      slicedEvent.show = null;
    });
  }

  private applySameColSpanToEveryIntersectEvents(currentEventOnCalender: CalendarEvent): void {
    let colSpanSize = (100 / (currentEventOnCalender.intersectEvents.length + 1));

    currentEventOnCalender.colSpans = colSpanSize;
    currentEventOnCalender.visited = true;
    currentEventOnCalender.startColIndex = 0;

    let startColIndexCounter = colSpanSize;

    currentEventOnCalender.intersectEvents.forEach((event) => {
      event.colSpans = colSpanSize;
      event.startColIndex = startColIndexCounter;
      event.visited = true;
      startColIndexCounter += colSpanSize;
    });
  }
}

export class ColumnDetails {
  constructor(public startColIndex: number, public availableCol: number) {

  }
}
