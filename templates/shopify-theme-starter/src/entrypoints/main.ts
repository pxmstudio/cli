document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hello`);
    const data = await response.json();
    console.log("data:", data);
})