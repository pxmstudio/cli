window.Webflow ||= [];
window.Webflow.push(async () => {
  console.log('Webflow is ready');

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hello`);
  const data = await response.json();
  console.log("data: ", data);
});