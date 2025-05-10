import OpenAI from 'openai';

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY || '';
export const openai = new OpenAI({ apiKey });

// Define models
export const MODELS = {
  GPT4: 'gpt-4o',
  GPT35: 'gpt-3.5-turbo',
};

// Helper function to generate personalized email content
export async function generateEmailContent({
  recipientInfo,
  senderInfo,
  jobDescription,
  customInstructions,
}: {
  recipientInfo: {
    name: string;
    company: string;
    jobTitle: string;
    department?: string;
    location?: string;
    linkedin?: string;
  };
  senderInfo: {
    name: string;
    jobTitle?: string;
    skills?: string[];
    experience?: string;
    resumeText?: string;
  };
  jobDescription?: string;
  customInstructions?: string;
}) {
  const prompt = `
You're helping craft a personalized referral request email.

RECIPIENT INFO:
- Name: ${recipientInfo.name}
- Company: ${recipientInfo.company}
- Job Title: ${recipientInfo.jobTitle}
${recipientInfo.department ? `- Department: ${recipientInfo.department}` : ''}
${recipientInfo.location ? `- Location: ${recipientInfo.location}` : ''}
${recipientInfo.linkedin ? `- LinkedIn: ${recipientInfo.linkedin}` : ''}

SENDER INFO:
- Name: ${senderInfo.name}
- Job Title: ${senderInfo.jobTitle || 'Not specified'}
${senderInfo.skills?.length ? `- Skills: ${senderInfo.skills.join(', ')}` : ''}
${senderInfo.experience ? `- Experience: ${senderInfo.experience}` : ''}

${jobDescription ? `JOB DESCRIPTION: ${jobDescription}` : ''}

${customInstructions ? `CUSTOM INSTRUCTIONS: ${customInstructions}` : ''}

GUIDELINES:
1. Create a personalized, concise email requesting a referral
2. Use a friendly, professional tone
3. Reference specific details from the recipient's background to establish relevance
4. Briefly highlight sender's relevant qualifications that match the company/role
5. Clearly ask for a referral
6. Offer to provide additional information
7. Express gratitude
8. Keep it under 200 words
9. Do NOT include fake information or made-up connections
10. Format with proper spacing, greeting, and signature

EMAIL STRUCTURE:
- Subject line
- Body content
- Closing
`;

  const completion = await openai.chat.completions.create({
    model: MODELS.GPT4,
    messages: [
      { role: 'system', content: 'You are an expert at writing personalized, effective referral request emails.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// Function to analyze resume and extract key information
export async function analyzeResume(resumeText: string) {
  const prompt = `
Analyze the following resume and extract key information in JSON format:
${resumeText}

Extract the following information:
1. Full name
2. Current/most recent job title
3. Years of experience
4. Key skills (as an array)
5. Key accomplishments
6. Education
7. Brief professional summary (2-3 sentences)
`;

  const completion = await openai.chat.completions.create({
    model: MODELS.GPT35,
    messages: [
      { role: 'system', content: 'You are an expert resume analyzer. Extract structured information from resumes.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  try {
    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (e) {
    console.error('Error parsing resume analysis:', e);
    return {};
  }
} 