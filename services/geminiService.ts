
import { GoogleGenAI, Type } from "@google/genai";
import type { Resource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const resourceSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, descriptive title for the resource."
        },
        summary: {
            type: Type.STRING,
            description: "A detailed summary of the resource, typically 2-4 sentences long."
        },
        category: {
            type: Type.STRING,
            description: "A relevant category for the resource, e.g., 'Academics', 'Sports', 'Extracurricular'."
        }
    },
    required: ["title", "summary", "category"],
};

export const findResources = async (userQuery: string): Promise<Resource[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user's original query, possibly in Sinhala, is "R/EMB/ROYAL COLLEGE සම්පත් ප්‍රමාණය", which translates to "Royal College Resource Quantity". Interpret this and any follow-up queries broadly as a request for information about resources available at Royal College, Colombo, Sri Lanka.

            Based on the specific user query: "${userQuery}", find and summarize relevant resources. Provide a list of 5 to 8 diverse and informative resources.

            Return the response as a JSON array of objects that strictly adheres to the provided schema. Do not return markdown or any text outside of the JSON array.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: resourceSchema,
                },
                temperature: 0.5,
            },
        });

        const jsonText = response.text;
        const resources = JSON.parse(jsonText);

        if (!Array.isArray(resources)) {
            throw new Error("API did not return a valid array of resources.");
        }

        return resources as Resource[];

    } catch (error) {
        console.error("Error fetching resources from Gemini API:", error);
        throw new Error("Failed to fetch resources. The model may be unavailable or the query could not be processed.");
    }
};
