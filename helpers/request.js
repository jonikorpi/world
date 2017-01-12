export default async (request) => {
  console.log("Requesting", request);

  await fetch("/", {
    method: "POST",
    body: request,
  });
};
