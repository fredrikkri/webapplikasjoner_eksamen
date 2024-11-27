'use client';
import React from "react";
import Home from "@/components/Home";
import EventsFilter from "../../components/events/EventsFilter";
import RegCard  from "../../components/admin/registrationCard"

const waitlist = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" }
];

const waitlist2 = [
  { name: "Alice", email: "alice@example.com" }
];

export default function EventsPage() {
    return (
    <Home>
      <RegCard event="Tech conf 2024" waitlist={waitlist}/>
      <EventsFilter />
      </Home>
    )
  }

  