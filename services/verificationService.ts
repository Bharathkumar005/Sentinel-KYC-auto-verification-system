import { VerificationResult } from "../types";

const API_URL = "http://localhost:8000";

export const analyzeKYCSubmission = async (
  documentBase64: string,
  selfieBase64: string
): Promise<VerificationResult> => {
  try {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentBase64,
        selfieBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const result = await response.json();
    return result as VerificationResult;
    
  } catch (error) {
    console.error("Verification failed:", error);
    // Graceful fallback if Python backend is offline
    return {
      documentValid: false,
      faceMatchScore: 0,
      tamperDetected: false,
      riskScore: 100,
      reasoning: "Connection to Python Backend failed. Is main.py running on port 8000?",
      extractedData: {}
    };
  }
};