import server from "./server";

const port = 3099;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
