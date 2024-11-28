'use client';
import React from "react";
import Home from "@/components/Home";
import { Event } from "../../../../types/Event";
import { useParams } from "next/navigation";
import RegCard from "@/components/admin/registrationCard";
import { useEvent } from "@/hooks/useEvent";
import { useWaitlist } from "@/hooks/useWaitlistRegistration";

export default function Admin() {
    const params = useParams();
    const slug = params?.slug as string;
    const { event, loading, error } = useEvent(slug);
    const { waitlist } = useWaitlist(slug)
    return ( 
    <Home>
        <RegCard event={event} waitlist={waitlist}/>
    </Home>
      );
  }

  