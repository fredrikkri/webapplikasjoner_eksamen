'use client';
import { useParams } from "next/navigation";
import React from "react";
import EditEventButton from "../../../../components/admin/editEventButton"
import Home from "@/components/Home";
import EditEvent from "@/components/admin/EditEvent";


export default function Event() {
    const params = useParams();
    const slug = params?.slug as string;
    return ( 
    <Home>
      <EditEvent eventSlug={slug}/>
    </Home>
      );
  }

  