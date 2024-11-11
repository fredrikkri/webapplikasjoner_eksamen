'use client';
import { useParams } from "next/navigation";
import React from "react";
import SingleEvent from "../../../components/SingleEvent"

export default function Event() {
    const params = useParams();
    const slug = params?.slug as string;
    return <SingleEvent slug={slug}/>;
  }

  