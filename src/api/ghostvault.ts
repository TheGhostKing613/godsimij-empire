import axios from "axios";
import { mockScrolls, mockProjects, mockMedia } from "./mock-data";

const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE || 
                      import.meta.env.VITE_API_BASE === "mock";

const base = import.meta.env.VITE_API_BASE || "";

export async function getScrolls() {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(mockScrolls);
  }
  return axios.get(`${base}/scrolls`).then(r => r.data);
}

export async function getMedia() {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(mockMedia);
  }
  return axios.get(`${base}/media`).then(r => r.data);
}

export async function getProjects() {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(mockProjects);
  }
  return axios.get(`${base}/projects`).then(r => r.data);
}
