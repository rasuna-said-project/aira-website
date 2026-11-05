"use client";

import { useSyncExternalStore } from "react";
import {
  bacaHasilKalkulator,
  HASIL_KALKULATOR_KEY,
} from "@/lib/hasilKalkulator";

const subscribe = () => () => {};

const ambilSnapshot = () => {
  return sessionStorage.getItem(HASIL_KALKULATOR_KEY);
};

const ambilServerSnapshot = () => null;

export function useHasilKalkulator() {
  const raw = useSyncExternalStore(
    subscribe,
    ambilSnapshot,
    ambilServerSnapshot
  );

  return bacaHasilKalkulator(raw);
} 