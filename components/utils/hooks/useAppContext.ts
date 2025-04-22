"use client";
import { useContext } from "react";
import { TempValueContext } from "../contextAPI/TempValueContext";

const useAppContext = () => {
  return useContext(TempValueContext);
};

export default useAppContext;
