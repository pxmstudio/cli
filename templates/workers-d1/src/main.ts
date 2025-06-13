const createUser = async (name: string, email: string) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      email
    })
  });
}

const getUsers = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
  const data = await response.json();
  console.log("data: ", data);
}

window.Webflow ||= [];
window.Webflow.push(async () => {
  console.log('Webflow is ready');

  const randomNumber = Math.floor(Math.random() * 1000000);

  await createUser(`John Doe ${randomNumber}`, `john.doe${randomNumber}@example.com`);
  await getUsers();
});

