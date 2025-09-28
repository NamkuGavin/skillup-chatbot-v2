const INDUSTRY_DATA = {
  tech: [
    "Programming",
    "Data Analysis",
    "AI/ML",
    "Cloud Computing",
    "Cybersecurity",
  ],
  marketing: [
    "Digital Marketing",
    "Content Creation",
    "SEO/SEM",
    "Social Media",
    "Analytics",
  ],
  finance: [
    "Financial Analysis",
    "Accounting",
    "Investment",
    "Risk Management",
    "Auditing",
  ],
};

export class SkillUpTools {
  analyzeIndustrySkills(industry) {
    const skills = INDUSTRY_DATA[industry.toLowerCase()] || [
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Adaptability",
    ];

    return {
      industry,
      inDemandSkills: skills,
      recommendations: `Fokus pada: ${skills.slice(0, 3).join(", ")}`,
      learningResources: [
        `Online courses untuk ${skills[0]}`,
        `Bergabung komunitas ${industry}`,
        `Project praktik mandiri`,
      ],
    };
  }

  generateInterviewQuestions(role, experienceLevel = "mid") {
    const questions = {
      recruiter: [
        "Ceritakan tentang diri Anda dan pengalaman kerja",
        "Mengapa Anda tertarik dengan posisi ini?",
        "Bagaimana Anda menangani konflik dalam tim?",
        "Apa pencapaian terbesar Anda di pekerjaan sebelumnya?",
        "Apa kelemahan Anda dan bagaimana mengimprovensinya?",
      ],
      technical: [
        "Jelaskan project teknikal terbaru yang Anda kerjakan",
        "Bagaimana Anda menyelesaikan masalah teknis yang kompleks?",
        "Apa metodologi pengembangan yang Anda kuasai?",
        "Bagaimana Anda menjaga keterampilan teknis tetap update?",
      ],
    };

    return questions[role] || questions["recruiter"];
  }
}
