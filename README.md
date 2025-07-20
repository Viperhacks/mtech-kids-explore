# Mtech Academy

Mtech Academy is a modern, accessible educational platform built to empower primary school learners. It provides high-quality resources, interactive content, and tools for students, teachers, and parents.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Key Achievements](#key-achievements)
- [Contributing](#contributing)
- [License](#license)

---

## About

Mtech Academy is dedicated to providing accessible, high-quality educational resources for primary school students. Our mission is to empower young learners to succeed academically and develop a lifelong love for learning.

**Vision:**  
A future where every child has equal access to educational opportunities, regardless of background or circumstances.

**Our Story:**  
Started by educators passionate about digital learning, the platform has grown from a set of digital worksheets into a comprehensive platform serving thousands of students.

**Values:**
- Excellence in Education
- Innovation & Creativity
- Inclusivity & Accessibility
- Child-Centered Learning
- Continuous Improvement

---

## Features

- **Student Dashboard:** Personalized learning and progress tracking.
- **Revision & Tutorials:** Engaging, interactive content for different grades and subjects.
- **Teacher Tools:** Resource management and content creation.
- **Parent & Admin Support:** Secure profiles and access controls.
- **Google OAuth:** Easy, secure login.
- **Responsive UI:** Built with Tailwind CSS and shadcn-ui for a modern look.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** shadcn-ui, Tailwind CSS, Lucide icons
- **State/Data:** TanStack React Query, React Hook Form, Zod
- **Authentication:** Google OAuth
- **Utilities:** date-fns, axios, embla-carousel-react, recharts
- **Packaging:** Electron (for desktop), electron-builder

---

## Getting Started

### Prerequisites

- Node.js & npm ([Install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
git clone https://github.com/VIPERtips/mtech-kids-explore.git
cd mtech-kids-explore
npm install
```

### Running Locally

Start the Vite development server:

```sh
npm run dev
```

For the Electron app (desktop):

```sh
npm run dev:electron
```

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run dev:electron` - Start Electron with Vite
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

---

## Project Structure

```
src/
  App.tsx              # Main application entry with routing
  pages/               # Page components (Home, About, Dashboard, etc)
  components/          # Reusable UI components
  context/             # React context (AuthProvider, etc)
  lib/                 # Utility libraries (e.g. Electron integration)
public/
  ...
```

---

## Deployment

1. **Web:**  
   Build with `npm run build` and deploy `dist/` to your preferred host.

2. **Desktop:**  
   Use Electron & electron-builder:  
   ```sh
   npm run dist
   ```
   The appId is `com.mtechkids.app` and the bundled product is `MTechKidsExplore
   
   to be safe run  npm run dist -- --config.electronDownload.force=true 
   `.

---

## Key Achievements

- Reached 10,000+ students
- Winner: Educational Excellence Award 2023
- Partnered with 50+ schools
- Over 1,000 educational resources

---

## Contributing

Contributions are welcome! Please open issues or pull requests to suggest changes or report bugs.

---

## License

MIT

---

**Author:**  
Tadiwa Blessed  
