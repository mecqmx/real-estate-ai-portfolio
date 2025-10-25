# 📦 Real Estate Web Project with AI Agents

---

## 🚀 Project Overview
## 🚀 Project Vision & Overview

This project is a modern real estate web application, designed to showcase properties and optimize key processes through the integration of **Artificial Intelligence Agents**. Built with **Next.js** and styled with **Tailwind CSS**, it serves as a central component of my professional portfolio,
highlighting my skills in **full-stack development**. This includes modern frontend implementation, robust backend architecture with **relational database management**, secure authentication, data validation, and the practical application of **AI for real-world solutions**.

The core AI feature is a **Property Description Assistant**, which leverages a third-party Large Language Model (LLM) via an API to automatically generate compelling and optimized property descriptions. This demonstrates a practical, scalable approach to AI integration, moving from an initial experimental phase with a custom-trained LSTM model to a more robust, production-ready solution.

### ✨ Key Features

* **Interactive Property Catalog:** Explore properties with a clean and responsive interface.
* **Advanced Search Filters:** Filter properties by price, type, number of bedrooms, and bathrooms for efficient searching.
* **AI-Powered Content Generation (Coming Soon):** Integration of AI agents to automate property description creation, ensuring engaging and optimized content.
* **Intelligent Form Validation (Coming Soon):** Leveraging AI to improve data accuracy and efficiency in form validation.
* **Modern & Responsive Design:** Intuitive user interface built with Tailwind CSS, compatible across various devices.
*   **Comprehensive User Authentication:** Secure Sign In/Up functionality with email verification and distinct user roles (Agent, Client, Admin).
*   **Interactive Property Catalog:** A clean, responsive interface for exploring properties, complete with CRUD (Create, Read, Update, Delete) capabilities for agents.
*   **Advanced Search & Filtering:** Efficiently filter properties by price, type, number of bedrooms, and bathrooms.
*   **User Profile Management:** A dedicated UI for users to edit their information.
*   **AI-Powered Content Generation:** Integration of an AI assistant to automate property description creation, ensuring engaging and optimized content.
*   **Modern & Responsive Design:** Intuitive user interface built with Tailwind CSS, compatible across various devices.

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
    * [**OpenAI API**](https://openai.com/api/) (for text generation and intelligent validation)
    * **Third-Party LLM API (e.g., OpenAI):** For property description generation.
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
    In the root of your project, create a file named `.env.local`. This is where you'll store sensitive API keys. For now, if you don't have OpenAI keys, you can leave it empty or add a placeholder.
    Copy the contents of `.env.example` (if it exists) and fill in your own values.

    ```
    # .env.local
    # OPENAI_API_KEY=your_openai_api_key_here
    DATABASE_URL="your_database_connection_string"
    NEXT_PUBLIC_API_KEY_THIRD_PARTY_LLM="your_llm_api_key_here"
    ```
    *(Ensure this file is not committed to Git. Next.js's `.gitignore` usually excludes it by default.)*
    *(This file is excluded from Git by default in `.gitignore`.)*

### **Run the Development Server**

1.  **Start the application:**
    ```bash
    npm run dev
    # or if you use Yarn
    # yarn dev
    ```

2.  **Access the application:**
    Open your browser and visit `http://localhost:3000`.

---

## 📂 Project Structure
## 🗺️ Recommended Next Steps

1.  **Set Up the AI Assistant API Route:**
    *   Create a new API route in Next.js (e.g., `src/app/api/generate-description/route.js`).
    *   This route will securely handle requests from the frontend, call the third-party LLM API with the property details, and return the generated description.
    *   Store the LLM API key in `.env.local` and access it only on the server-side to keep it secure.

The main folder structure of the project is as follows:
2.  **Integrate the AI Assistant in the Frontend:**
    *   In the property creation/editing form, add a button like "Generate Description with AI".
    *   When clicked, this button will trigger a `fetch` call to our new API route.
    *   Display a loading state while the description is being generated.
    *   Populate the description textarea with the response from the API.

real-estate-ai-portfolio/
├── public/                 # Static assets (images, favicon, etc.)
├── src/
│   ├── app/                # Application routes (App Router)
│   │   ├── properties/     # Property catalog pages
│   │   │   └── page.js     # Main catalog page
│   │   └── layout.js       # Main application layout
│   ├── components/         # Reusable React components
│   │   └── PropertyCard.jsx
│   ├── data/               # Local project data (e.g., properties.js)
│   │   └── properties.js
│   ├── styles/             # Global styles (Tailwind CSS)
│   └── globals.css
├── .env.local              # Local environment variables
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
3.  **Refine and Test:**
    *   Refine the prompt sent to the LLM to ensure high-quality, consistent descriptions.
    *   Add robust error handling for API calls (e.g., if the LLM service is down).
    *   Write tests for the new API route and frontend integration.


---

## 🤝 Contributions and Contact

This project is constantly evolving! If you're interested in contributing, have questions, or just want to connect, feel free to:

* **Open an `Issue`:** If you find a bug or have a suggestion.
* **Submit a `Pull Request`:** If you've implemented an improvement or fix.

You can contact me directly through my [GitHub profile](https://github.com/punkymx) or on [LinkedIn](https://www.linkedin.com/in/miguel-colli-a00145351/).

---

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
 