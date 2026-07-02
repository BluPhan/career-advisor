import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { IT_SKILLS, QUESTIONS } from "../data";
import { getCareerMatches, getSkillGap } from "../utils";

const PLATFORM_COLORS = {
  Coursera: "bg-blue-600/20 text-blue-300",
  Udemy: "bg-purple-600/20 text-purple-300",
  freeCodeCamp: "bg-green-600/20 text-green-300",
  Free: "bg-emerald-600/20 text-emerald-300",
  YouTube: "bg-red-600/20 text-red-300",
  Microsoft: "bg-sky-600/20 text-sky-300",
  "TCM Security": "bg-orange-600/20 text-orange-300",
  Book: "bg-yellow-600/20 text-yellow-300",
};

function PlatformBadge({ platform }) {
  const color = PLATFORM_COLORS[platform] || "bg-gray-600/20 text-gray-300";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {platform}
    </span>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [step, setStep] = useState("skills");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [careerMatches, setCareerMatches] = useState([]);
  const [chosenCareer, setChosenCareer] = useState(null);
  const [customCareer, setCustomCareer] = useState("");
  const [skillGaps, setSkillGaps] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const navigate = useNavigate();

  async function loadUserData(uid) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.username) setUsername(data.username);
        if (data.skills && data.skills.length > 0) {
          setSelectedSkills(data.skills);
        }
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserData(currentUser.uid);
        setUsername(currentUser.displayName || currentUser.email);
      } else {
        navigate("/", { replace: true });
      }
    });
    return () => unsubscribe();
  }, []);

  function toggleSkill(skill) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function startQuiz() {
    const relevant = QUESTIONS.filter((q) => selectedSkills.includes(q.skill));
    const fallback = relevant.length > 0 ? relevant : QUESTIONS.slice(0, 5);
    setQuizQuestions(fallback);
    setAnswers({});
    setCurrentQ(0);
    setStep("quiz");
  }

  function handleAnswer(questionId, answerIndex) {
    setAnswers({ ...answers, [questionId]: answerIndex + 1 });
  }

  async function nextQuestion() {
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      const matches = getCareerMatches(answers, selectedSkills);
      setCareerMatches(matches);
      setStep("results");
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            username: username,
            email: user.email,
            skills: selectedSkills,
            answers: answers,
            lastUpdated: new Date().toISOString(),
          },
          { merge: true },
        );
      } catch (err) {
        console.error("Could not save results:", err);
      }
    }
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/", { replace: true });
  }

  const question = quizQuestions[currentQ];
  const progress =
    quizQuestions.length > 0
      ? Math.round((currentQ / quizQuestions.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-lg">
              IT Career Advisor
            </span>
            {step !== "skills" && (
              <span className="hidden sm:inline text-gray-600 text-sm">
                /
                <button
                  onClick={() => {
                    setStep("skills");
                    setChosenCareer(null);
                  }}
                  className="ml-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Start Over
                </button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-gray-400 text-sm">
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* STEP 1 — Skill Selection */}
        {step === "skills" && (
          <div>
            <div className="bg-gradient-to-r from-blue-900/40 to-gray-900 border border-blue-800/30 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-1">
                Welcome, {username || "..."}! 👋
              </h2>
              <p className="text-gray-400 text-sm">
                Let's find your ideal IT career. Start by selecting the skills
                you already have.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Your Current Skills</h3>
                {selectedSkills.length > 0 && (
                  <span className="text-blue-400 text-sm font-medium">
                    {selectedSkills.length} selected
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Tap all the skills you are comfortable working with.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {IT_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedSkills.includes(skill)
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                        : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {selectedSkills.includes(skill) ? "✓ " : ""}
                    {skill}
                  </button>
                ))}
              </div>

              {selectedSkills.length > 0 && (
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={startQuiz}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/30"
                  >
                    Analyse My Skills →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 — Quiz */}
        {step === "quiz" && question && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  Question {currentQ + 1} of {quizQuestions.length}
                </span>
                <span>{progress}% complete</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 sm:p-8">
              <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {question.skill}
              </span>

              <h2 className="text-xl sm:text-2xl font-semibold mb-8 leading-snug">
                {question.text}
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, index)}
                    className={`text-left px-5 py-4 rounded-xl text-sm font-medium transition-all border ${
                      answers[question.id] === index + 1
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                        : "bg-transparent border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-gray-500 mr-3 font-mono text-xs">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={nextQuestion}
                disabled={!answers[question.id]}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {currentQ + 1 === quizQuestions.length
                  ? "See My Results →"
                  : "Next Question →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Career Recommendations */}
        {step === "results" && !chosenCareer && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">
                Your Career Matches 🎯
              </h2>
              <p className="text-gray-400 text-sm">
                Based on your skill profile, here are your top IT career
                matches.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {careerMatches.slice(0, 5).map((career, i) => (
                <div
                  key={career.id}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-600 font-bold text-lg mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {career.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {career.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-2xl font-bold ${
                          career.matchPercent >= 70
                            ? "text-green-400"
                            : career.matchPercent >= 40
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {career.matchPercent}%
                      </span>
                      <p className="text-gray-500 text-xs">match</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        career.matchPercent >= 70
                          ? "bg-green-500"
                          : career.matchPercent >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${career.matchPercent}%` }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setChosenCareer(career);
                      setSkillGaps(
                        getSkillGap(career, answers, selectedSkills),
                      );
                    }}
                    className="text-sm bg-gray-800 hover:bg-blue-600 border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all"
                  >
                    View Skill Gap Analysis →
                  </button>
                </div>
              ))}
            </div>

            {/* Custom career */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold mb-1 text-sm text-gray-300">
                Have a different career in mind?
              </h3>
              <p className="text-gray-500 text-xs mb-3">
                Enter any IT career and we'll analyse your skill gaps for it.
              </p>
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  + Enter a career manually
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCareer}
                    onChange={(e) => setCustomCareer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customCareer.trim()) {
                        const match = careerMatches.find((c) =>
                          c.title
                            .toLowerCase()
                            .includes(customCareer.toLowerCase()),
                        ) || {
                          title: customCareer,
                          requiredSkills: {},
                          matchPercent: 0,
                          description: "Custom career goal",
                        };
                        setChosenCareer(match);
                        setSkillGaps(getSkillGap(match, answers));
                      }
                    }}
                    placeholder="e.g. Blockchain Developer"
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-700"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (customCareer.trim()) {
                        const match = careerMatches.find((c) =>
                          c.title
                            .toLowerCase()
                            .includes(customCareer.toLowerCase()),
                        ) || {
                          title: customCareer,
                          requiredSkills: {},
                          matchPercent: 0,
                          description: "Custom career goal",
                        };
                        setChosenCareer(match);
                        setSkillGaps(
                          getSkillGap(match, answers, selectedSkills),
                        );
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep("skills")}
              className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
            >
              ← Start over
            </button>
          </div>
        )}

        {/* STEP 4 — Skill Gap Analysis */}
        {step === "results" && chosenCareer && (
          <div>
            <div className="mb-8">
              <button
                onClick={() => {
                  setChosenCareer(null);
                  setSkillGaps([]);
                }}
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg mb-4 transition-all"
              >
                ← Back to matches
              </button>
              <h2 className="text-2xl font-bold mb-1">Skill Gap Analysis 📊</h2>
              <p className="text-gray-400 text-sm">
                Career goal:{" "}
                <span className="text-white font-semibold">
                  {chosenCareer.title}
                </span>
              </p>
            </div>

            {skillGaps.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">🎉</p>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  You're fully qualified!
                </h3>
                <p className="text-gray-400 text-sm">
                  Your skills already meet all the requirements for{" "}
                  {chosenCareer.title}.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {skillGaps.map(
                  ({ skill, required, userScore, gap, courses }) => (
                    <div
                      key={skill}
                      className={`bg-gray-900 border rounded-2xl p-5 ${
                        gap <= 0 ? "border-green-800/40" : "border-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">{skill}</h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            gap <= 0
                              ? "bg-green-600/20 text-green-400"
                              : "bg-yellow-600/20 text-yellow-400"
                          }`}
                        >
                          {gap <= 0 ? "✓ Met" : `Gap: ${gap}`}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Your level</span>
                            <span>{userScore}/5</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${(userScore / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Required</span>
                            <span>{required}/5</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full"
                              style={{ width: `${(required / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {gap <= 0 && (
                        <p className="text-green-400 text-xs">
                          ✓ You already meet the requirement for this skill!
                        </p>
                      )}

                      {gap > 0 && courses.length > 0 && (
                        <div className="border-t border-gray-800 pt-4">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
                            Recommended Courses
                          </p>
                          <div className="flex flex-col gap-2">
                            {courses.map((course) => (
                              <a
                                key={course.url}
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-all"
                              >
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <span className="text-sm text-white font-medium group-hover:text-blue-300 transition-colors">
                                    {course.title}
                                  </span>
                                  <PlatformBadge platform={course.platform} />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                  {course.description}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {gap > 0 && courses.length === 0 && (
                        <p className="text-gray-500 text-xs mt-2">
                          No courses available for this skill yet.
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
