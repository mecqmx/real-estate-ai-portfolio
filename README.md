# 📦 Real Estate Web Project with AI Agents

---

## 🚀 Project Overview
## 🚀 Project Vision & Overview

This project is a modern real estate web application, designed to showcase properties and optimize key processes through the integration of **Artificial Intelligence Agents**. Built with **Next.js** and styled with **Tailwind CSS**, it serves as a central component of my professional portfolio,
highlighting my skills in **full-stack development**. This includes modern frontend implementation, robust backend architecture with **relational database management**, secure authentication, data validation, and the practical application of **AI for real-world solutions**.

The core AI feature is a **Property Description Assistant**, which leverages a third-party Large Language Model (LLM) via an API to automatically generate compelling and optimized property descriptions. This demonstrates a practical, scalable approach to AI integration, moving from an initial experimental phase with a custom-trained LSTM model to a more robust, production-ready solution.
The core AI feature, a **Property Description Assistant**, is now ready and leverages the **Gemini API** (a Large Language Model) to automatically generate compelling and optimized property descriptions. This demonstrates a practical, scalable, and production-ready AI integration, showcasing a robust solution beyond initial experimental phases.

### ✨ Key Features (Ready)

* **Interactive Property Catalog:** Explore properties with a clean and responsive interface.
* **Advanced Search Filters:** Filter properties by price, type, number of bedrooms, and bathrooms for efficient searching.
* **AI-Powered Content Generation:** Integration of AI agents to automate property description creation, ensuring engaging and optimized content.
* **Intelligent Form Validation (Coming Soon):** Leveraging AI to improve data accuracy and efficiency in form validation.
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
* **Backend / Database (to be defined/integrated):**
    * [**Firebase / Supabase**](https://firebase.google.com/) (for user authentication and document/data management)
* **Backend / Database:**
    * [**NextAuth.js**](https://next-auth.js.org/) (Authentication for Next.js)
    * [**Prisma**](https://www.prisma.io/) (Next-generation ORM for Node.js and TypeScript)
    * _(Database to be specified, e.g., PostgreSQL, MySQL)_
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
    git clone [https://github.com/your_username/your_repository_name.git](https://github.com/your_username/your_repository_name.git)
    git clone https://github.com/punkymx/real-estate-ai-portfolio.git
    ```
    (Remember to replace `your_username` with your GitHub username and `your_repository_name` with your actual repository name!)

2.  **Navigate to the project directory:**
    ```bash
    cd your_repository_name # e.g., cd real-estate-ai-portfolio
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
    DATABASE_URL="your_database_connection_string"
    NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key_here"
    ```
    *(Ensure this file is not committed to Git. Next.js's `.gitignore` usually excludes it by default.)*
    *(This file is excluded from Git by default in `.gitignore`.)*

### **Run the Development Server**

---

## 🧠 AI Prompt Engineering

The core of the "Property Description Assistant" lies in the quality of the prompt sent to the Gemini API. The current implementation (`src/app/api/generate-description/route.js`) uses a carefully structured prompt to ensure high-quality, consistent, and relevant outputs.

### Prompt Strategy

The prompt is designed with the following principles:

1.  **Role-Playing:** The prompt instructs the AI to act as a `professional real estate copywriter`, setting the context and desired tone.
2.  **Clear Rules:** A numbered list of rules guides the AI's output, covering key aspects like:
    *   Tailoring the message based on the operation type (`Rent` vs. `Sale`).
    *   Incorporating location details for a local feel.
    *   Ensuring a concise and engaging tone.
    *   Ending with a specific call to action.
3.  **Structured Data Input:** Property data is passed in a clean, easy-to-parse format, clearly separating it from the instructions. This includes dynamic data like `Title`, `Location`, `Price`, and `Features`.
4.  **Output Formatting Constraint:** The prompt explicitly tells the AI to generate *only* the description text, preventing it from adding extra titles, labels, or markdown formatting.

This structured approach makes the AI's behavior more predictable and the output more reliable for direct use in the application's frontend.

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
│   │   │       └── route.js  # AI description generator
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
 