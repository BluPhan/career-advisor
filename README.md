# 🚀 IT Career Advisor

A personalised career recommendation system for the IT sector. Built with React, Firebase and Tailwind CSS.

---

## 🌐 Live Demo

[View Live App](https://your-vercel-url.vercel.app) <!-- Replace with your actual Vercel URL after deployment -->

---

## 📌 What It Does

IT Career Advisor helps users discover the right IT career path based on their current skills. The app:

1. **Authenticates users** via email and password (Firebase Auth)
2. **Collects skill data** — users select from 50 IT skills they are comfortable with
3. **Runs a proficiency quiz** — 22 questions tailored to the user's selected skills
4. **Recommends careers** — matches users to 20 IT careers with a percentage match score
5. **Performs skill gap analysis** — compares the user's proficiency against career requirements
6. **Recommends courses** — suggests 110+ curated online courses to bridge identified skill gaps
7. **Supports custom career input** — users can manually enter any IT career goal

---

## 🛠️ Tech Stack

| Technology    | Purpose                           |
| ------------- | --------------------------------- |
| React + Vite  | Frontend framework and build tool |
| Tailwind CSS  | Utility-first styling             |
| Firebase Auth | Email/password authentication     |
| Firestore     | User data and skill persistence   |
| Vercel        | Deployment and hosting            |

---

## Features

- 🔐 Secure signup and login with username support
- 💡 50 selectable IT skills
- 📝 22 proficiency quiz questions (skill-specific)
- 🎯 20 IT career matches with percentage scores
- 📊 Visual skill gap analysis with progress bars
- 📚 110+ course recommendations with platform badges
- 💾 Skills persist across sessions via Firestore
- 📱 Fully responsive — works on mobile and desktop
- ⌨️ Enter key support throughout the app

---

## 📁 Project Structure

```
career-advisor/
├── src/
│   ├── pages/
│   │   ├── Login.jsx        # Login page with app bio
│   │   ├── Signup.jsx       # Signup page with username
│   │   └── Dashboard.jsx    # Main app — skills, quiz, results
│   ├── data.js              # Skills, careers, questions, courses
│   ├── utils.js             # Career matching & gap analysis logic
│   ├── firebase.js          # Firebase configuration
│   └── main.jsx             # App entry point
├── .env                     # Environment variables (not committed)
├── index.html
└── vite.config.js
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js v18+
- A Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/career-advisor.git
cd career-advisor
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

---

## 🔧 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** under Authentication → Sign-in method
3. Create a **Firestore Database** in test mode
4. Register a web app and copy the config values into your `.env` file
5. Add your deployment URL to Firebase → Authentication → Authorised domains

---

## 📊 How the Matching Algorithm Works

Each career has a set of required skills with proficiency levels from 1–5. After the quiz, each answer is scored 1–5. The algorithm:

- Compares the user's score against each career's requirements
- Caps the user score at the required level (you can't be over-qualified)
- Calculates a match percentage based on total achievable points
- Sorts careers from highest to lowest match

The skill gap analysis then shows the difference between required and current levels, and recommends courses only for skills with a gap greater than zero.

---

## 📦 Deployment

This app is deployed on [Vercel](https://vercel.com). To deploy your own:

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add all `VITE_*` environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Vite and configures the build

---

## 👤 Author

Built as a learning project using React, Firebase and Tailwind CSS.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
