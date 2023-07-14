import test, { expect } from "@playwright/test";

test("Set Auth0 Token", async ({ request }) => {
  const response = await request.post(`${process.env.AUTH_URL}`, {
    data: {
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      client_id: process.env.AUTH_CLIENT_ID,
      username: process.env.PAT_USERNAME,
      password: process.env.PAT_PASSWORD,
      audience: process.env.API_URL,
      realm: "revel-admin",
    },
    headers: {
      Referer: "https://admin.test.revel-health.com"
    }
  });
  console.log(process.env.PAT_USERNAME + " " +  process.env.PAT_PASSWORD)

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  const token = responseBody.access_token;
  await request.storageState({ path: "./config/auth.json" });
});
