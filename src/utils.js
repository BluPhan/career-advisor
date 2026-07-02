import { CAREERS, COURSES, QUESTIONS } from "./data";

export function getCareerMatches(answers, selectedSkills) {
  const userScores = buildUserScores(answers, selectedSkills);

  const scored = CAREERS.map((career) => {
    const requiredSkills = Object.keys(career.requiredSkills);
    let totalScore = 0;
    let maxScore = 0;

    requiredSkills.forEach((skill) => {
      const required = career.requiredSkills[skill];
      const userScore = userScores[skill] ?? 0;
      maxScore += required;
      totalScore += Math.min(userScore, required);
    });

    const matchPercent =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return { ...career, matchPercent };
  });

  return scored.sort((a, b) => b.matchPercent - a.matchPercent);
}

function buildUserScores(answers, selectedSkills) {
  const scores = {};

  // For every skill the user selected, find their quiz answer
  selectedSkills.forEach((skill) => {
    const question = QUESTIONS.find((q) => q.skill === skill);
    if (question && answers[question.id]) {
      scores[skill] = answers[question.id];
    } else {
      // User selected this skill but had no question for it
      // Give them a baseline score of 3 (Comfortable)
      scores[skill] = 3;
    }
  });

  return scores;
}

export function getSkillGap(career, answers, selectedSkills) {
  const userScores = buildUserScores(answers, selectedSkills || []);
  const gaps = [];

  Object.entries(career.requiredSkills).forEach(([skill, required]) => {
    const userScore = userScores[skill] ?? 0;
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
