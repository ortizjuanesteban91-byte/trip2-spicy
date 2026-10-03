// Friendly first names for the chat assistant. Each chat session gets one at random so several guests chatting at once see different "agents".
// The assistant is always honest that it is Trip2's virtual assistant if asked.
export const PERSONAS = [
  { name: "Maria", color: "#0e7490" }, { name: "Sofia", color: "#be185d" }, { name: "Valeria", color: "#7c3aed" }, { name: "Carlos", color: "#b45309" },
]; // 3 women + 1 man; each browser keeps the same one
export const personaByName = (n) => PERSONAS.find((p) => p.name === n) || PERSONAS[0];

// One fixed name per visitor IP (same person keeps the same assistant name on every visit/device network).
export const personaForIp = (ip) => { let h = 0; for (const c of String(ip || "x")) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PERSONAS[h % PERSONAS.length]; };
