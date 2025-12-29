// Use Vite env var `VITE_API_BASE` in dev/production; fallback to localhost
const API_BASE_URL = `${'https://backend-medical-lab.vercel.app/api' || 'http://localhost:5003/api'}`;
export default API_BASE_URL;
