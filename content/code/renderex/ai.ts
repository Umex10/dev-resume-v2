"use server";

import { GoogleGenAI } from "@google/genai";

// Wir nutzen den Key aus der .env für Sicherheit
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function aiDo(userInput: string) {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
    });

    // Wir geben das Ergebnis an den Editor zurück
    return res.text;
  } catch (error) {
    console.error("Fehler in main():", error);
    return "KI-Fehler. Überprüfe dein Guthaben oder den Key.";
  }
}