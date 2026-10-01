import tours from "@/data/tours.json";
import posts from "@/data/posts.json";
export { tours, posts };
export const GRADS = ["from-sky-300 to-teal-700","from-emerald-300 to-emerald-800","from-amber-200 to-lime-700","from-cyan-200 to-blue-700","from-green-300 to-teal-800","from-slate-300 to-slate-700"];
export const grad = (i) => GRADS[i % GRADS.length];
export const tourBySlug = (s) => tours.find((t) => t.slug === s);
export const postBySlug = (s) => posts.find((t) => t.slug === s);
export const tourHref = (s) => `/tour/${s}`;
