'use client';
import React from "react";
import Home from "@/components/Home";
import { Event } from "../../../../types/Event";
import { useParams } from "next/navigation";
import RegCard from "@/components/admin/registrationCard";
import { useEvent } from "@/hooks/useEvent";

const waitlist = [
    {
      id: '1',
      event_id: '101',
      email: 'alice@example.com',
      has_paid: 'false',
      registration_date: '2024-11-25T14:30:00Z',
      order_id: 'ORD12345',
    },
    {
      id: '2',
      event_id: '101',
      email: 'bob@example.com',
      has_paid: 'true',
      registration_date: '2024-11-26T10:00:00Z',
      order_id: 'ORD12346',
    },
    {
      id: '3',
      event_id: '102',
      email: 'charlie@example.com',
      has_paid: 'false',
      registration_date: '2024-11-27T09:00:00Z',
      order_id: 'ORD12347',
    },
    {
      id: '4',
      event_id: '103',
      email: 'david@example.com',
      has_paid: 'true',
      registration_date: '2024-11-28T08:00:00Z',
      order_id: 'ORD12348',
    },
  ];
  
  const event: Event = {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'A conference to discuss the latest trends in technology and innovation.',
    date: '2024-12-10T09:00:00Z',
    location: 'Silicon Valley Conference Center, California, USA',
    slug: 'tech-conference-2024',
    event_type: 'Conference',
    total_slots: 500,
    available_slots: 200,
    price: 150,
  };

export default function Admin() {
    const params = useParams();
    const slug = params?.slug as string;
    const { event, loading, error } = useEvent(slug);
    return ( 
    <Home>
        <RegCard event={event} waitlist={waitlist}/>
    </Home>
      );
  }

  