import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppBar from "./AppBar";
import TabsBar from "./TabsBar";
import Slider from "./Slider";
import SliderText from "./SliderText";
import MainHeader from "./MainHeader";

export default function MainLayout() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");

  return (
    <>
      <AppBar />
      <MainHeader />
      <TabsBar />
      <Slider />
      <SliderText />
      <Outlet />
    </>
  );
}