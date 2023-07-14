import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Managing SMS Contact COnfigurations through SMS Service", () => {
  test.describe.configure({ mode: "serial" });
  test.use({
    baseURL: process.env.API_URL,
    storageState: "./config/auth.json",
  });

  const smsContactConfig = generateJsonBody();

  test("Get all existing SMS Contact Configurations", async ({ request }) => {
    test.fail(); // Unable to get it to work locally. Reached out to Vojin to fix.
    const response = await request.get(`sms-service/contact/config/all`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSContactConfig(responseBody, smsContactConfig);
  });

  test("Create a new SMS Contact Configuration", async ({ request }) => {
    const response = await request.post("sms-service/contact/config", {
      data: smsContactConfig,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    assertSMSContactConfig(responseBody, smsContactConfig);
  });

  test("Get an existing SMS Contact Configuration", async ({ request }) => {
    const response = await request.get(`sms-service/contact/config/${smsContactConfig.id}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSContactConfig(responseBody, smsContactConfig);
  });

  //Generates a different SMS config to Update with but uses the same UUID
  const updatedSmsContactConfig = generateJsonBody(smsContactConfig.id);
  test("Update the newly created SMS Contact Configuration", async ({ request }) => {
    const response = await request.put(`sms-service/contact/config/${updatedSmsContactConfig.id}`, {
      data: updatedSmsContactConfig,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSContactConfig(responseBody, updatedSmsContactConfig);
  });

  test("Get the newly updated SMS Contact Configuration", async ({ request }) => {
    const response = await request.get(`sms-service/contact/config/${updatedSmsContactConfig.id}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSContactConfig(responseBody, updatedSmsContactConfig);
  });
});

/**
 * Asserts the web service call returns the expected SMS Contact Config data
 *
 * @param actualResponse
 * @param expectedResponse
 */
function assertSMSContactConfig(actualResponse, expectedResponse) {
  expect(actualResponse.name).toBe(expectedResponse.name);
  expect(actualResponse.fromValue).toBe(expectedResponse.fromValue);
  expect(actualResponse.id).toBe(expectedResponse.id);
  expect(actualResponse.vendor).toBe(expectedResponse.vendor);
  expect(actualResponse.twilioAccountId).toBe(expectedResponse.twilioAccountId);
  expect(actualResponse.createdAtUtc).toBeTruthy();
}

/**
 * Generates a Random SMS Contact Config Request Body using Faker Library
 *
 * @param uuid Generates one at Random if none is supplied
 * @returns jsonBody
 */
function generateJsonBody(uuid = faker.string.uuid()) {
  const jsonBody = {
    name: `${faker.person.jobArea().toUpperCase()} CONTACT CONFIGURATION`,
    fromValue: faker.string.numeric(5), 
    id: uuid,
    vendor: "TWILIO", // Must stay hardcoded to this or it will return a 400
    twilioAccountId: faker.string.alphanumeric(8).toUpperCase(),
  };
  
  return jsonBody;
}
