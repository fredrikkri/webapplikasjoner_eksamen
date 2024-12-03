'use client';
import React from "react";
import Home from "@/components/Home";
import { useParams } from "next/navigation";
import RegCard from "@/components/admin/registrationCard";
import { useEvent } from "@/hooks/useEvent";
import { useWaitlist } from "@/hooks/useWaitlistRegistration";
import AdminEvent from "@/components/admin/adminEvent";

export default function Admin() {
    const params = useParams();
    const slug = params?.slug as string;
    const { event } = useEvent(slug);
    const { waitlist } = useWaitlist(slug)
    return ( 
    <Home>
        <AdminEvent event={event}/>
        <RegCard event={event} waitlist={waitlist} />
    </Home>
      );
  }
