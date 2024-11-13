'use client';
import { useParams } from "next/navigation";
import React from "react";
import SingleEvent from "../../../components/SingleEvent"
import Home from "@/components/Home";

export default function Event() {
    const params = useParams();
    const id = params?.id as string;
    return ( 
    <Home>
      <SingleEvent slug={id}/>
    </Home>
      );
  }

  