'use client';
import { useParams } from "next/navigation";
import React from "react";
import SingleTemplate from "../../../components/templates/SingleTemplate"
import Home from "@/components/Home";

export default function Template() {
    const params = useParams();
    const slug = params?.slug as string;
    return ( 
    <Home>
      <SingleTemplate slug={slug}/>
    </Home>
      );
  }

  