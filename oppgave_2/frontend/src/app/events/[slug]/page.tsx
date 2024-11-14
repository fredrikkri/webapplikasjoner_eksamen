'use client';
import { useParams } from "next/navigation";
import React from "react";
import SingleEvent from "../../../components/events/SingleEvent"
import Home from "@/components/Home";

export default function Event() {
    const params = useParams();
    const slug = params?.slug as string;
    return ( 
    <Home>
      <SingleEvent slug={slug}/>
    </Home>
      );
  }

  