import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import "./Shifts.css";
function Shifts() {
  const [events, setEvents] = useState([
    {
      event_id: 1,
      title: "Morning Shift",
      start: new Date("2024-07-01T09:00:00"),
      end: new Date("2024-07-01T12:00:00"),
    },
    {
      event_id: 2,
      title: "Afternoon Shift",
      start: new Date("2024-07-01T13:00:00"),
      end: new Date("2024-07-01T16:00:00"),
    },
  ]);

  const handleConfirm = async (event, action) => {
    if (action === "edit") {
      setEvents((prev) =>
        prev.map((evt) => (evt.event_id === event.event_id ? event : evt))
      );
    } else if (action === "create") {
      setEvents((prev) => [...prev, { ...event, event_id: events.length + 1 }]);
    } else if (action === "delete") {
      setEvents((prev) =>
        prev.filter((evt) => evt.event_id !== event.event_id)
      );
    }
    return Promise.resolve(event);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Scheduler
        className="shift"
        view="week"
        events={events}
        onConfirm={handleConfirm}
        height={600}
        editable={true}
        deletable={true}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: 7,
          endHour: 22,
          step: 60,
          navigation: true,
        }}
        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: 7,
          endHour: 22,
          navigation: true,
        }}
        day={{
          startHour: 7,
          endHour: 22,
          step: 60,
          navigation: true,
        }}
        onEventClick={(event) => console.log(event)}
        onSelectDate={(date) => console.log(date)}
        onViewChange={(view) => console.log(view)}
      />
    </div>
  );
}

export default Shifts;
