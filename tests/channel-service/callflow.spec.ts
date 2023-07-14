import test, { expect } from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';

test.describe("Uploading and Retrieving a WAV file from Channel Service", () => {
  test.describe.configure({ mode: "serial" });
  test.use({
    baseURL: process.env.API_URL,
    storageState: ".config/auth.json",
  });
  
  const uuid = "042aa830-2606-4680-9fe0-bfbd5b2d510b"; // Hardcoded for now but want to generate randomly with uuidv4
  const audioFileName = "StarWars3.wav";
  const filePath = path.resolve(`./test_files/wav_files/${audioFileName}`);

  test("Upload a new WAV file to Amazon S3", async ({ request }) => {
    const response = await request.post(`channel-service/voice/callflow/upload/${uuid}`, {
      multipart: {
          prompt: fs.createReadStream(filePath),
      },
    });
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.numOfFile).toBeTruthy();
    expect(responseBody.callFlowId).toBe(uuid);
  });

  test("Retieve an uploaded WAV file from Amazon S3", async ({ request, }) => {
    const response = await request.get(`channel-service/voice/callflow/${uuid}/prompt/${audioFileName}`);
    
    expect(response.status()).toBe(200);
    const responseBody = await response.body(); // Returns a binary file
    expect(responseBody).toBeTruthy();
  });
});
