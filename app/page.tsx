"use client";

import { useEffect, useState } from "react";
import Login from "./auth/Login";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  if (!token) {
    return <Login />;
  }

  // return <HomeScreen />;
}
