import { CAREERS, COURSES } from "./data";

export function getCareerMatches(answers) {
  const scored = CAREERS.map((career) => {
    const requiredSkills = Object.keys(career.requiredSkills);
    let totalScore = 0;
    let maxScore = 0;

    requiredSkills.forEach((skill) => {
      const required = career.requiredSkills[skill];
      const userScore = findUserScore(answers, skill);
      maxScore += required;
      totalScore += Math.min(userScore, required);
    });

    const matchPercent =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return { ...career, matchPercent };
  });

  return scored.sort((a, b) => b.matchPercent - a.matchPercent);
}

function findUserScore(answers, skill) {
  const skillAnswers = Object.entries(answers).filter(([qId]) => {
    return qId.startsWith("q") && answers[qId] !== undefined;
  });

  const match = skillAnswers.find(([qId, score]) => {
    const questionSkill = getSkillForQuestion(qId);
    return questionSkill === skill;
  });

  return match ? match[1] : 0;
}

function getSkillForQuestion(questionId) {
  const map = {
    q1: "Python",
    q2: "Python",
    q3: "JavaScript",
    q4: "JavaScript",
    q5: "React",
    q6: "React",
    q7: "SQL",
    q8: "SQL",
    q9: "Machine Learning",
    q10: "Machine Learning",
    q11: "Docker",
    q12: "Docker",
    q13: "AWS",
    q14: "AWS",
    q15: "Cybersecurity",
    q16: "Cybersecurity",
    q17: "Networking",
    q18: "Networking",
    q19: "Git",
    q20: "Linux",
    q21: "Data Analysis",
    q22: "Data Visualization",
  };
  return map[questionId] || null;
}

export function getSkillGap(career, answers) {
  const gaps = [];

  Object.entries(career.requiredSkills).forEach(([skill, required]) => {
    const userScore = findUserScore(answers, skill);
    const gap = required - userScore;

    gaps.push({
      skill,
      required,
      userScore,
      gap,
      courses: COURSES[skill] || [],
    });
  });

  return gaps.sort((a, b) => b.gap - a.gap);
}
