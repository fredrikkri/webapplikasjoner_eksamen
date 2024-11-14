'use client';
import React from "react";
import Home from "@/components/Home";
import EventsByDate from "../../components/events/EventsByDate";

export default function EventsPage() {
    return (
    <Home>
      <EventsByDate />
      </Home>
    )
  }

  