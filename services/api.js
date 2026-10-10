export async function fetchData(endpoint) {
  // Helper fungsi fetching data backend/database
  try {
    const res = await fetch(endpoint);
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}