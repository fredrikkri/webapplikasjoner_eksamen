'use client';
import React from "react";
import Home from "@/components/Home";
import EventsFilter from "../../components/events/EventsFilter";
import DownloadExcel from "@/components/DownloadeExcel";

export default function EventsPage() {
    return (
    <Home>
      <DownloadExcel />
    </Home>
    )
  }

  