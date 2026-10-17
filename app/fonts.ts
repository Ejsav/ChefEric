import { Instrument_Sans, Instrument_Serif } from "next/font/google";

// Instrument Serif: a tall, slightly condensed display serif with a cinematic,
// editorial voice — the type of a film title card or a couture invitation.
// Its sibling Instrument Sans carries UI and body on the same proportions,
// so the pairing reads as one hand.
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});
