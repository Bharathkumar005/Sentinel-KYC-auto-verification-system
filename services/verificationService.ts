import { VerificationResult } from "../types";

// Use 127.0.0.1 instead of localhost to avoid IPv6/IPv4 resolution issues
const API_URL = "http://127.0.0.1:8000";

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
    
    // Return a structured error result so the UI doesn't crash
    return {
      documentValid: false,
      faceMatchScore: 0,
      tamperDetected: false,
      riskScore: 100,
      reasoning: "Connection to Python Backend failed. Please ensure 'python backend/main.py' is running on port 8000.",
      extractedData: {}
    };
  }
};