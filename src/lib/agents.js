import { SkillUpTools } from "./tools.js";
import { CareerRAGSystem } from "./rag.js";
import { generateResponse } from "./gemini.js";

export class SkillUpAgent {
  constructor() {
    this.tools = new SkillUpTools();
    this.rag = new CareerRAGSystem();
    this.conversationContext = [];
  }

  async processMessage(userMessage, context = {}) {
    try {
      this.updateContext("user", userMessage);

      const intent = this.detectIntent(userMessage);
      console.log("Detected intent:", intent);

      let response;
      switch (intent) {
        case "skill_analysis":
          response = await this.handleSkillAnalysis(userMessage);
          break;
        case "interview_practice":
          response = await this.handleInterviewPractice(userMessage, context);
          break;
        case "career_advice":
          response = await this.handleCareerAdvice(userMessage);
          break;
        default:
          response = await this.handleGeneralQuery(userMessage);
      }

      this.updateContext("assistant", response);
      return response;
    } catch (error) {
      console.error("Error in processMessage:", error);
      return "Maaf, terjadi error saat memproses permintaan Anda. Silakan coba lagi.";
    }
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("skill") ||
      lowerMessage.includes("kemampuan") ||
      lowerMessage.includes("analisis") ||
      lowerMessage.includes("ability")
    ) {
      return "skill_analysis";
    }

    if (
      lowerMessage.includes("wawancara") ||
      lowerMessage.includes("interview") ||
      lowerMessage.includes("latihan") ||
      lowerMessage.includes("practice")
    ) {
      return "interview_practice";
    }

    if (
      lowerMessage.includes("karir") ||
      lowerMessage.includes("career") ||
      lowerMessage.includes("tips") ||
      lowerMessage.includes("saran") ||
      lowerMessage.includes("pengembangan") ||
      lowerMessage.includes("development")
    ) {
      return "career_advice";
    }

    return "general";
  }

  async handleSkillAnalysis(message) {
    try {
      const industries = [
        "tech",
        "marketing",
        "finance",
        "healthcare",
        "education",
        "technology",
      ];
      const foundIndustry = industries.find((ind) =>
        message.toLowerCase().includes(ind)
      );
      const industry = foundIndustry || "tech";

      const analysis = this.tools.analyzeIndustrySkills(industry);
      const ragResults = this.rag.searchCareerInfo(industry);

      const prompt = `Anda adalah asisten karir SkillUp. Berikan analisis skill untuk industri ${industry} berdasarkan data berikut:
      
**Data Analisis Skill:**
- Skills yang paling dibutuhkan: ${analysis.inDemandSkills.join(", ")}
- Rekomendasi fokus belajar: ${analysis.recommendations}
- Resources belajar: ${analysis.learningResources.join(", ")}

**Info Pasar Kerja:**
${
  ragResults.length > 0
    ? ragResults.map((r) => `- ${r.data.name || r.data}`).join("\n")
    : "Data tidak ditemukan"
}

Berikan respons yang praktis dan actionable. Fokus pada skills yang paling high-demand dan berikan langkah-langkah konkret untuk mempelajarinya.`;

      return await generateResponse(message, prompt);
    } catch (error) {
      console.error("Error in handleSkillAnalysis:", error);
      return 'Maaf, terjadi error saat menganalisis skill. Coba sebutkan industri yang lebih spesifik seperti "technology", "marketing", atau "finance".';
    }
  }

  async handleInterviewPractice(message, context) {
    try {
      const role = context.role || "recruiter";
      const industry = context.industry || "technology";

      const questions = this.tools.generateInterviewQuestions(role);
      const currentQuestionIndex = context.questionIndex || 0;
      const currentQuestion =
        questions[currentQuestionIndex % questions.length];

      const prompt = `Anda berperan sebagai ${role} dari industri ${industry} dalam sesi wawancara.

**Pertanyaan Saat Ini:** "${currentQuestion}"

**Instruksi:**
1. Evaluasi jawaban user secara profesional
2. Berikan feedback yang membangun
3. Lanjutkan dengan pertanyaan berikutnya
4. Jadilah supportive dan helpful

Format:
- **Feedback:** [Evaluasi jawaban]
- **Saran:** [Tips perbaikan]  
- **Pertanyaan Selanjutnya:** [Pertanyaan baru]`;

      context.questionIndex = currentQuestionIndex + 1;

      return await generateResponse(message, prompt);
    } catch (error) {
      console.error("Error in handleInterviewPractice:", error);
      return "Maaf, terjadi error dalam sesi latihan wawancara. Silakan coba lagi.";
    }
  }

  async handleCareerAdvice(message) {
    try {
      const ragResults = this.rag.searchCareerInfo(message);
      const developmentResources = this.rag.getCareerDevelopmentResources();

      const prompt = `Anda adalah mentor karir SkillUp. Berikan advice pengembangan karir:

**Trend Karir Terkini:**
${ragResults
  .slice(0, 3)
  .map((result) => `- ${result.data.name || result.data}`)
  .join("\n")}

**Resources Pengembangan:**
- Platform Belajar: ${developmentResources.skillDevelopment.onlinePlatforms.join(
        ", "
      )}
- Sertifikasi Populer: ${developmentResources.skillDevelopment.certifications.join(
        ", "
      )}

Berikan saran yang praktis dan spesifik untuk konteks Indonesia. Fokus pada langkah-langkah actionable.`;

      return await generateResponse(message, prompt);
    } catch (error) {
      console.error("Error in handleCareerAdvice:", error);
      return "Saya bisa membantu dengan tips pengembangan karir. Coba tanya tentang: skill yang dibutuhkan, resources belajar, atau strategi mencari kerja.";
    }
  }

  async handleGeneralQuery(message) {
    try {
      const prompt = `Anda adalah SkillUp - asisten karir AI yang helpful dan informatif.
      
Fokus bantu pengguna dengan:
- Analisis skill untuk berbagai industri
- Latihan wawancara kerja
- Tips pengembangan karir
- Informasi pasar kerja terkini

Jadilah praktis, supportive, dan berikan saran yang actionable.`;

      return await generateResponse(message, prompt);
    } catch (error) {
      console.error("Error in handleGeneralQuery:", error);
      return "Halo! Saya SkillUp, asisten karir AI. Saya bisa membantu dengan analisis skill, latihan wawancara, dan tips karir. Ada yang bisa saya bantu?";
    }
  }

  updateContext(role, content) {
    this.conversationContext.push({ role, content, timestamp: new Date() });
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }
  }
}
