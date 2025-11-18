# 📦 Real Estate Web Project with AI Agents

---

> **Note:** The MVP of this project is functional but is currently on hold. Significant updates and improvements are needed before it is ready for deployment.

---

## 🚀 Project Vision & Overview

This project is a modern real estate web application, designed to showcase properties and optimize key processes through the integration of **Artificial Intelligence Agents**. Built with **Next.js** and styled with **Tailwind CSS**, it serves as a central component of my professional portfolio,
highlighting my skills in **full-stack development**. This includes modern frontend implementation, robust backend architecture with **relational database management**, secure authentication, data validation, and the practical application of **AI for real-world solutions**.
The core AI feature, a **Property Description Assistant**, is now ready and leverages the **Gemini API** (a Large Language Model) to automatically generate compelling and optimized property descriptions. This demonstrates a practical, scalable, and production-ready AI integration, showcasing a robust solution beyond initial experimental phases.

### ✨ Key Features (Ready)

* **Interactive Property Catalog:** Explore properties with a clean and responsive interface.
* **Advanced Search Filters:** Filter properties by price, type, number of bedrooms, and bathrooms for efficient searching.
* **AI-Powered Content Generation:** Integration of AI agents to automate property description creation, ensuring engaging and optimized content.
* **Modern & Responsive Design:** Intuitive user interface built with Tailwind CSS, compatible across various devices.
*   **Comprehensive User Authentication:** Secure Sign In/Up functionality with email verification and distinct user roles (Agent, Client, Admin).
*   **Interactive Property Catalog:** A clean, responsive interface for exploring properties, complete with CRUD (Create, Read, Update, Delete) capabilities for agents.
*   **Advanced Search & Filtering:** Efficiently filter properties by price, type, number of bedrooms, and bathrooms.
*   **User Profile Management:** A dedicated UI for users to edit their information.

### 💡 Future AI Integrations

*   **Document Classification:** A plan to implement a simpler, custom-trained model (e.g., LSTM) for classifying uploaded property documents, showcasing a different facet of applied machine learning.
*   **Intelligent Form Validation:** Leveraging AI to improve data accuracy and efficiency in form validation.

### 🗺️ Future Application Features

To build a more robust platform for real estate workflows, the following features are planned:

**For Agents:**
*   **Client Management:** A dedicated dashboard to view and manage client information and interactions.
*   **Inspection Calendar:** An interface to manage inspection requests and visualize appointments on a calendar.
*   **Contract Management:** A system to track important contract dates and related documents.
*   **Messaging Center:** Centralized communication with clients.

**For Clients:**
*   **Secure Document Upload:** A portal for clients to upload necessary documents (e.g., ID, proof of income).
*   **Application Tracking:** View the status of requested inspections and property applications.
*   **Favorites List:** Save and manage a list of favorite properties for easy access.
*   **Contract Access:** A section to view and manage signed contracts and important documents.

---

## 🛠️ Technologies Used

* **Frontend:**
    * [**Next.js**](https://nextjs.org/) (React Framework for production)
    * [**React**](https://react.dev/) (UI Library)
    * [**Tailwind CSS**](https://tailwindcss.com/) (Utility-first CSS Framework) 
* **Backend / Database:**
    * [**NextAuth.js**](https://next-auth.js.org/) (Authentication for Next.js)
    * [**Prisma**](https://www.prisma.io/) (Next-generation ORM for Node.js and TypeScript)
    * _(Database: PostgreSQL via Neon)_
* **Artificial Intelligence:**
    * [**Gemini API**](https://ai.google.dev/docs) (for text generation and intelligent validation)
* **Development & Deployment Tools:**
    * [**Git**](https://git-scm.com/) (Version Control)
    * [**GitHub**](https://github.com/) (Code Repository Hosting)
    * [**Vercel**](https://vercel.com/) (Deployment platform for Next.js)

---

## 🚀 How to Run the Project Locally

Follow these steps to get the project up and running on your machine.

### **Prerequisites**

Make sure you have the following installed:

* [Node.js](https://nodejs.org/en/) (version 18.x or higher recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/punkymx/real-estate-ai-portfolio.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd real-estate-ai-portfolio
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or if you use Yarn
    # yarn install
    ```

4.  **Create an environment file (`.env.local`):**
    In the root of your project, create a file named `.env.local` to store your sensitive API keys and database connection string. Copy the contents of `.env.example` (if it exists) and fill in your own values.

    ```
    # .env.local
    DATABASE_URL="your_postgresql_connection_string"
    GEMINI_API_KEY="your_gemini_api_key_here"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your_nextauth_secret"
    ```
    *(This file is excluded from Git by default in `.gitignore`.)*

### **Run the Development Server**

---

## 🧠 AI Prompt Engineering: A/B Testing & Strategy

The core of the "Property Description Assistant" is a flexible A/B testing framework that allows for dynamic switching between different prompt engineering strategies. This is managed in `src/app/api/generate-description/route.js`, which selects a prompt template based on user input from the frontend.

This approach demonstrates a key skill in applied AI: the ability to test, iterate, and select the best prompt for a specific task.

### The Prompts

The project includes two distinct prompts to compare their effectiveness:

1.  **`Basic_Prompt.txt`**: A direct, rule-based prompt. It provides clear, simple instructions to the LLM, focusing on generating a concise and factually accurate description. This prompt is effective for standard listings where clarity is key.

2.  **`Advanced_CoT_Prompt.txt`**: A more sophisticated prompt that uses an implicit **Chain-of-Thought (CoT)** methodology. Instead of just giving rules for the output, it guides the AI's internal thought process, instructing it to first identify a core narrative, select an emotional hook, and then weave a story. After iteration, this prompt now consistently produces more compelling, evocative, and marketing-oriented descriptions.

### Strategic Application in Marketing

This dual-prompt strategy is not just a technical demonstration; it's a practical marketing tool. By allowing agents to switch prompts, the application can instantly change the tone and focus of the generated content. This enables targeting different market segments effectively—for example, using the **Advanced** prompt for luxury listings that benefit from storytelling, and the **Basic** prompt for rental properties where speed and factual clarity are more important.

---

## 🗺️ Recommended Next Steps

Now that the core AI-powered Property Description Assistant is integrated and ready, here are some recommended next steps for further enhancement:

1.  **Refine and Optimize AI Prompts:**
    *   Continuously refine the prompts sent to the Gemini API to ensure even higher quality, consistency, and relevance of generated property descriptions.
    *   Experiment with different prompt engineering techniques to achieve desired tonality and detail levels.

2.  **Enhance Error Handling and User Feedback:**
    *   Implement more comprehensive error handling for Gemini API calls, providing clear feedback to users in case of issues.
    *   Consider adding retry mechanisms or alternative suggestions if API calls fail.

3.  **Explore Advanced AI Features:**
    *   Investigate further integrations with the Gemini API for features like sentiment analysis of property reviews, or generating marketing copy variations.

4.  **Implement Future AI Integrations:**
    *   Proceed with the planned "Document Classification" and "Intelligent Form Validation" features as outlined in the "Future AI Integrations" section.

---

## 📂 Project Folder Structure

The main folder structure of the project is as follows:
real-estate-ai-portfolio/
├── .env.local              # Local environment variables (untracked)
├── .gitignore              # Git ignore file
├── docs/                   # Project documentation files
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── public/                 # Static assets (images, favicon, etc.)
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma
├── README.md               # This file
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/ # NextAuth.js dynamic route handler
│   │   │   │       └── route.js
│   │   │   ├── admin/
│   │   │   │   └── users/
│   │   │   │       ├── [id]/
│   │   │   │       │   └── route.js # Handles user updates and deletion
│   │   │   │       └── route.js     # Handles fetching all users
│   │   │   ├── properties/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js  # Handles GET (single), PUT, DELETE
│   │   │   │   └── route.js      # Handles GET (all), POST
│   │   │   ├── register/
│   │   │   │   └── route.js      # Handles new user registration
│   │   │   └── generate-description/
│   │   │       ├── route.js      # AI description generator API
│   │   │       ├── Basic_Prompt.txt
│   │   │       └── Advanced_CoT_Prompt.txt
│   │   ├── auth/                 # Authentication-related pages
│   │   │   ├── signin/page.js
│   │   │   └── signup/page.js
│   │   ├── properties/     # Frontend pages for properties
│   │   └── layout.js       # Main application layout
│   ├── components/         # Reusable React components
│   ├── styles/             # Global styles (Tailwind CSS)
│   └── globals.css
└── tailwind.config.js      # Tailwind CSS configuration
---

## 🤝 Contributions and Contact

This project is constantly evolving! If you're interested in contributing, have questions, or just want to connect, feel free to:

* **Open an `Issue`:** If you find a bug or have a suggestion.
* **Submit a `Pull Request`:** If you've implemented an improvement or fix.

You can contact me directly through my [GitHub profile](https://github.com/punkymx) or on [LinkedIn](https://www.linkedin.com/in/miguel-colli-a00145351/).

---

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
 