// Friendly first names for the chat assistant. Each chat session gets one at random so several guests chatting at once see different "agents".
// The assistant is always honest that it is Trip2's virtual assistant if asked.
export const PERSONAS = [
  { name: "Maria", color: "#0e7490" }, { name: "Carlos", color: "#b45309" }, { name: "Sofia", color: "#be185d" },
  { name: "Mateo", color: "#4d7c0f" }, { name: "Valeria", color: "#7c3aed" }, { name: "Diego", color: "#0369a1" },
  { name: "Camila", color: "#c2410c" }, { name: "Luis", color: "#15803d" },
];
export const personaByName = (n) => PERSONAS.find((p) => p.name === n) || PERSONAS[0];
