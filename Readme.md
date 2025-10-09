# CV-Gen: AI-Powered Resume Builder

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

CV-Gen is a **modern, AI-powered resume builder** that allows users to create, customize, and download professional resumes in minutes. Built with **React, TypeScript, FastAPI, Tailwind CSS**, and integrated with smart AI features for a seamless resume creation experience.

---

## 🚀 Features

- **Multiple Resume Templates:** Choose from pre-designed templates for Software Engineers, Finance Professionals, and more.
- **Step-by-Step Form:** Guided form inputs for personal info, experience, skills, projects, and education.
- **Live Preview:** See changes in real-time while filling your resume.
- **Color Customization:** Choose primary and text colors for your resume.
- **AI-Powered Assistance:** Helps design resumes optimized for recruiter attention.
- **Download as PDF:** Export resumes in a professional format.
- **Responsive Design:** Works on desktop, tablet, and mobile devices.
- **Pre-commit Hooks:** Ensures clean, consistent code with linters and formatters (ESLint, Black, Prettier).

---


## 📁 Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** FastAPI, Python
- **Database:** PostgreSQL (optional)
- **State Management:** React Context API
- **Linting & Formatting:** ESLint, Prettier, Black (Python)
- **Version Control:** Git + Pre-commit hooks

---

## ⚙️ Getting Started

### Clone the repository
```bash
git clone https://github.com/yourusername/CV-Gen.git
cd CV-Gen
```

### Install Dependencies
```bash
make install-client
make install-server
```


### Start Servers
```bash
make start-client      # only frontend
make start-server      # only backend
make start             # both frontend and backend in parallel
```

### Clean Servers
```bash
make clean
```
