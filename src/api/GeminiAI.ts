/* eslint-disable no-undef */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import dotenv from 'dotenv';
import { addHistoryGemini, getHistoryGemini, updateHistoryGemini } from '../controller/gemini_model.js';
import { getPromptModel } from '../controller/prompt_model.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFileManager = async (videoBuffer: any, mimeType: string) => {
  return new Promise(async (resolve, reject) => {
      try {
          fs.writeFileSync(path.join(__dirname, '../public/video.mp4'), videoBuffer);
          const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);
          const uploadResponse = await fileManager.uploadFile(path.join(__dirname, '../public/video.mp4'), {
            mimeType,
            displayName: "Random video",
          });
          const name = uploadResponse.file.name;
          let file = await fileManager.getFile(name);
          while (file.state === FileState.PROCESSING) {
            process.stdout.write('.');
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            file = await fileManager.getFile(name);
          }

          if(file.state === FileState.FAILED) {
            fs.unlinkSync(path.join(__dirname, '../public/video.mp4'));
            reject("Error uploading file");
          } else if(file.state === FileState.ACTIVE) {
            fs.unlinkSync(path.join(__dirname, '../public/video.mp4'));
            resolve({
              fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
              }
            });
          }
      } catch(error) {
        console.log(error);
      }
  });
}

const fileToGenerativePart =(buffer: any, mimeType: string) => {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType,
    },
  };
}

const GeminiAI = async (prompt: string, senderId: string, file: any = false) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const prompts: string[] = await getPromptModel();
    const promptModel: string = prompts.map((item: any) => item.prompt).join('. ');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: promptModel,
      tools: [
        {
          codeExecution: {},
        },
      ],
     });
  
    const data: any = await getHistoryGemini(senderId);
    const chat = model.startChat({ history: data.history });
    
    if(file && file.buffer && file.mimeType.includes("video")) {
      const fileData: any = await uploadFileManager(file.buffer, file.mimeType);
      const result = await model.generateContent([prompt, fileData]);
      if(data.status) {
        updateHistoryGemini(senderId, [
          { role: "user", parts: [{ text: prompt }] },
          { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
        ])
      } else {
        addHistoryGemini(senderId, [
          { role: "user", parts: [{ text: prompt }] },
          { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
        ]);
      }
      return result.response.text();
    } else if(file && file.buffer && file.mimeType) {
        const fileData = fileToGenerativePart(file.buffer, file.mimeType);
        const result = await model.generateContent([prompt, fileData]);
        if(data.status) {
          updateHistoryGemini(senderId, [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
          ])
        } else {
          addHistoryGemini(senderId, [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
          ]);
        }
        return result.response.text();
    } else {
        const result = await chat.sendMessage(prompt);
        if(data.status) {
          updateHistoryGemini(senderId, [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
          ])
        } else {
          addHistoryGemini(senderId, [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: result.response.text().replace(/\n+$/, "") }] }
          ]);
        }
        return result.response.text();
    }
  } catch(error) {
    console.log(error);
  }
}

export default GeminiAI;