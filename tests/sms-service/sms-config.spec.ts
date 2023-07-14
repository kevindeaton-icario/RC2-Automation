import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Managing SMS COnfigurations through SMS Service", () => {
  test.describe.configure({ mode: "serial" });
  test.use({
    baseURL: process.env.API_URL,
    storageState: "./config/auth.json",
  });

  const smsConfig = generateJsonBody();

  test("Create a new SMS Configuration", async ({ request }) => {
    const response = await request.post("sms-service/config", {
      data: smsConfig,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    assertSMSConfig(responseBody, smsConfig);
  });

  test("Get an existing SMS Configuration", async ({ request }) => {
    const response = await request.get(`sms-service/config/${smsConfig.id}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSConfig(responseBody, smsConfig);
  });

  //Generates a different SMS config to Update with but uses the same UUID
  const updatedSmsConfig = generateJsonBody(smsConfig.id);
  test("Update the newly created SMS Configuration", async ({ request }) => {
    const response = await request.put(`sms-service/config/${updatedSmsConfig.id}`, {
      data: updatedSmsConfig,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSConfig(responseBody, updatedSmsConfig);
  });

  test("Get the newly updated SMS Configuration", async ({ request }) => {
    const response = await request.get(`sms-service/config/${updatedSmsConfig.id}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    assertSMSConfig(responseBody, updatedSmsConfig);
  });
});

/**
 * Asserts the web service call returns the expected SMS Config data
 *
 * @param actualResponse
 * @param expectedResponse
 */
function assertSMSConfig(actualResponse, expectedResponse) {
  expect(actualResponse.id).toBe(expectedResponse.id);
  expect(actualResponse.optOutMessage).toBe(expectedResponse.optOutMessage);
  expect(actualResponse.helpMessage).toBe(expectedResponse.helpMessage);
  expect(actualResponse.optInConfig.enabled).toBe(expectedResponse.optInConfig.enabled);
  expect(actualResponse.optInConfig.optInMessage).toBe(expectedResponse.optInConfig.optInMessage);
}

/**
 * Generates a Random SMS Config Request Body using Faker Library
 *
 * @param uuid Generates one at Random if none is supplied
 * @returns jsonBody
 */
function generateJsonBody(uuid = faker.string.uuid()) {
  const animal = faker.animal.type();
  const jsonBody = {
    id: uuid,
    optOutMessage: `You have successfully unsubscribed from facts about ${animal}s`,
    helpMessage: `Contact us at ${faker.phone.number("###-###-####")} with questions. Reply STOP to cancel.`,
    optInConfig: {
      enabled: faker.datatype.boolean(),
      optInMessage: `We want hear your feedback. Reply YES to participate in texts about ${animal}s`,
    },
  };

  return jsonBody;
}
