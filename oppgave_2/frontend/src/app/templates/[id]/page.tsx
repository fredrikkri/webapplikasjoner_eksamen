'use client';
import { useParams } from "next/navigation";
import React from "react";
import SingleTemplate from "../../../components/SingleTemplate"
import Home from "@/components/Home";

export default function Template() {
    const params = useParams();
    const id = params?.id as string;
    return ( 
    <Home>
      <SingleTemplate id={id}/>
    </Home>
      );
  }

  