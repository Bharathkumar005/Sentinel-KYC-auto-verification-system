import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeKYCSubmission = async (
  documentBase64: string,
  selfieBase64: string
): Promise<VerificationResult> => {
  
  if (!process.env.API_KEY) {
    console.warn("No API Key provided. Returning mock data for demo purposes.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          documentValid: true,
          faceMatchScore: 92,
          tamperDetected: false,
          riskScore: 15,
          extractedData: {
            name: "John Doe",
            dob: "1990-01-01",
            idNumber: "ABC12345"
          },
          reasoning: "Mock verification: Document appears clear. Face match high."
        });
      }, 3000);
    });
  }

  try {
    // Extract base64 data if it contains the data:image prefix
    const cleanDoc = documentBase64.split(',')[1] || documentBase64;
    const cleanSelfie = selfieBase64.split(',')[1] || selfieBase64;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `You are an advanced KYC (Know Your Customer) AI Verification Agent. 
            Analyze the provided Identification Document (Image 1) and Selfie (Image 2).
            
            Perform the following tasks:
            1. OCR: Extract Name, DOB, and ID Number from the document.
            2. Face Match: Compare the face in the ID with the Selfie. Provide a match confidence score (0-100).
            3. Tamper Detection: Look for digital artifacts, mismatched fonts, or edges that suggest the ID is fake.
            4. Risk Scoring: Calculate a risk score (0-100) where 100 is high risk (fraud) and 0 is low risk.
               - High face match lowers risk.
               - Tampering signs increase risk massively.
               - Illegible text increases risk.
            
            Return the result in JSON format.`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanDoc
            }
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanSelfie
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentValid: { type: Type.BOOLEAN },
            faceMatchScore: { type: Type.NUMBER, description: "Score between 0 and 100" },
            tamperDetected: { type: Type.BOOLEAN },
            riskScore: { type: Type.NUMBER, description: "Score between 0 and 100" },
            extractedData: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dob: { type: Type.STRING },
                idNumber: { type: Type.STRING }
              }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VerificationResult;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("KYC Verification Failed:", error);
    // Fallback error state
    return {
      documentValid: false,
      faceMatchScore: 0,
      tamperDetected: false,
      riskScore: 100,
      reasoning: "System error during verification process. Manual review required."
    };
  }
};