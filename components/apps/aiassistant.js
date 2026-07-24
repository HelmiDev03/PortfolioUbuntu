import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

export class AIAssistant extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      userInput: "",
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    // Add a welcome message
    this.setState({
      messages: [
        {
          role: "assistant",
          content: "Hello! I'm Helmi Lakhder's AI Assistant. How can I help you today?",
        },
      ],
    });
  }

  handleInputChange = (e) => {
    this.setState({ userInput: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  };

  handleSendMessage = async () => {
    const { userInput, messages } = this.state;
    if (!userInput.trim()) return;

    // Add user message to the chat
    const updatedMessages = [
      ...messages,
      { role: "user", content: userInput },
    ];

    this.setState({
      messages: updatedMessages,
      userInput: "",
      isLoading: true,
    });

    try {
      // Call Groq (OpenAI-compatible) directly from the frontend
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Groq API key");
      }

      const systemMessage = `IMPORTANT INSTRUCTIONS: You are an AI assistant dedicated exclusively to providing information about Helmi Lakhder.

CONSTRAINTS:
1. You must ONLY answer questions using information available in Helmi's website and CV
2. If you don't know something about Helmi from his website or CV, admit you don't know
3. NEVER make up information about Helmi that isn't in his website or CV
4. If asked about ANY topic not related to Helmi, politely decline and redirect to Helmi's professional information
5. You are NOT a general AI assistant - you are ONLY knowledgeable about Helmi
6. You should focus on Helmi's skills, experience, projects, education, and professional background

HELMI'S INFORMATION:
- Full Name: Mohamed Helmi Lakhder
- Self-Description: "Future Tech Pioneer"
- Contact: helmilakhder@gmail.com, mohamedhelmi.lakhdhar@insat.ucar.tn
- Phone: +216 90 217 664
- Location: Tunis, Tunisia
- Languages: French, English, Arabic
- Websites: www.helmi.engineer, www.helmiblog.engineer
- Social Media: GitHub (HelmiDev03), LinkedIn (helmipl)

EDUCATION:
- National Institute of Applied Science and Technology (INSAT) (Sept. 2024 - Present)
  * Engineer's Degree, ICT
- Higher Institute of Information Technologies and Communications (ISTIC) (Sept. 2021 - May. 2024)
  * B.S. in IoT & Embedded Systems | GPA: 4.0/4.0 | Valedictorian (2021/2022, 2022/2023, 2023/2024)

SKILLS:
- Languages: JavaScript, TypeScript, Python, C++, SQL, VHDL
- Frameworks & Libraries: React.js, Next.js, Angular, Nest.js, Express.js, Django, FastAPI, Spring Boot, Flutter
- Databases: MySQL, PostgreSQL, SQL Server, MongoDB, InfluxDB, Neo4j
- ML & AI: Machine Learning, Deep Learning, Transformers, LLMs, RAG, Embeddings, PyTorch
- IoT & Embedded: ESP32, STM32, PIC18, PSoC, FreeRTOS, Node-RED, MQTT, LabVIEW
- Big Data: Apache Hadoop, Apache Spark, BigSQL
- Cloud & DevOps: GCP, Microsoft Azure, AWS, Docker, Kubernetes, Apache Airflow, Ansible, Prometheus, Grafana
- Tools & Practices: Git, GitHub, GitHub Actions, CI/CD, REST APIs, GraphQL, Microservices, Pytest, Jest, Agile/Scrum

EXPERIENCE:
- Biolyt AI · Full-Stack AI Engineer (Jul. 2025 - Present)
  * Summer Internship (Jul. 2025 – Aug. 2025) -> Part-time (Sep. 2025 – Present) - Bengaluru South, India (Remote)
  * Architected multi-agent AI systems for pharmaceutical drug discovery and clinical trial intelligence, integrating FDA compliance analysis and enterprise knowledge graphs.
  * Developed production-ready full-stack AI applications by integrating LLMs, LangGraph agent orchestration, FastAPI backend services, and React.js user interfaces.
  * Engineered distributed web scrapers targeting 100+ data sources to build a centralized data lake, utilizing Apache Airflow and SCD pipelines for automated, incremental updates.
  * Stack: React.js, FastAPI, LangGraph, Neo4j, MCP, ELT, Apache Airflow, MongoDB, SearXNG, Docker, AWS (EC2, WorkSpaces, S3)
- Novencia Group · Full-Stack Developer (Feb. 2024 - May. 2024)
  * End-of-Studies Internship - Montplaisir, Tunis (On-site)
  * Co-developed core workforce management and attendance ERP modules within an Agile team.
  * Engineered flexible time-off and tracking features, reducing operational overhead.
  * Architected core business logic compliant with country-specific enterprise labor laws and regulatory frameworks.
  * Stack: Next.js, Flutter, Express.js, Redux, MongoDB, REST APIs, Tailwind CSS
- MAE Assurances · Back-End Developer (Jul. 2023 - Aug. 2023)
  * Summer Internship - Ariana, Tunis (Hybrid)
  * Developed an internal insurance platform with face-recognition authentication to streamline operational workflows and improve user access management.
  * Stack: Face Recognition, Django, PostgreSQL, Bootstrap, Chart.js, Prism.js

COMPETITIVE PROGRAMMING:
- Meta Hacker Cup 2025 | Ranked 150th globally in Round 3 – Top 200 worldwide
- LeetCode | 700+ problems solved across all difficulty level

PROJECTS:
1. AI-Driven Autonomous Security Drone (Jun. 2026): Custom drone with ESP32 flight-controller and Orange Pi edge-AI stack running YOLOv8n, ArcFace, and monocular depth estimation. Telemetry pipeline over Wi-Fi to a Flutter app. (ESP32, Orange Pi, YOLOv8, MQTT)
2. Tunisia Job Recommendation System (Dec. 2025): Cloud-deployed system scraping LinkedIn via Airflow DAGs, matching CVs using all-MiniLM-L6-v2 embeddings. Llama 3.1 for parsing. (FastAPI, Next.js, PyTorch)
3. Classification of Cardiac Anomalies from ECG Signals (May 2025): Machine learning system classifying anomalies on MIT-BIH Arrhythmia dataset using Random Forest, SVM, KNN, Decision Tree.
4. Cho3la (Dec. 2023): Flame and gas detection system on ESP8266 NodeMCU with MQTT monitoring and Telegram alerts.`;

      const groqMessages = [
        { role: "system", content: systemMessage },
        ...updatedMessages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content })),
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Invalid JSON response (HTTP ${response.status})`);
      }

      if (!response.ok) {
        const apiErrorMessage = data?.error?.message;
        throw new Error(apiErrorMessage || `Groq API error (HTTP ${response.status})`);
      }

      const aiResponse = data?.choices?.[0]?.message?.content;
      if (aiResponse && typeof aiResponse === "string") {

        this.setState({
          messages: [
            ...updatedMessages,
            { role: "assistant", content: aiResponse },
          ],
          isLoading: false,
        });
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error calling Groq API:", error);
      const errorMessage = error.message && error.message.includes('Invalid response format')
        ? 'Sorry, I received an unexpected response from the AI service. Please try again later.'
        : error.message === 'Missing Groq API key'
          ? 'Sorry, the AI service is not configured (missing API key).'
          : 'Sorry, I encountered an error connecting to the AI service. Please try again later.';

      this.setState({
        messages: [
          ...updatedMessages,
          {
            role: "assistant",
            content: errorMessage,
          },
        ],
        isLoading: false,
        error: error.message,
      });
    }
  };

  renderMessages = () => {
    return this.state.messages.map((message, index) => (
      <div
        key={index}
        className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
          }`}
      >
        {message.role === "assistant" && (
          <div className="flex items-start mb-1">
            <img
              src="./themes/Yaru/apps/helmigpt.png"
              alt="Helmi AI"
              className="w-6 h-6 mr-1"
            />
            <span className="text-xs text-gray-400">Helmi AI</span>
          </div>
        )}
        <div
          className={`inline-block p-3 rounded-lg ${message.role === "user"
            ? "bg-ub-orange text-white"
            : "bg-gray-700 text-white"
            }`}
        >
          {message.role === "user" ? (
            message.content
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    ));
  };

  render() {
    const { userInput, isLoading } = this.state;

    return (
      <div className="h-full w-full flex flex-col bg-ub-cool-grey p-4">
        <div className="flex-grow overflow-y-auto mb-4 p-2">
          {this.renderMessages()}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-700 text-white">
                <div className="flex items-center">
                  <div className="dot-typing"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex">
          <textarea
            className="flex-grow p-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
            placeholder="Ask me about Helmi Lakhder..."
            value={userInput}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            rows={2}
          />
          <button
            className="bg-ub-orange hover:bg-orange-600 text-white px-4 rounded-r-lg"
            onClick={this.handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <style jsx>{`
          .dot-typing {
            position: relative;
            left: -9999px;
            width: 6px;
            height: 6px;
            border-radius: 5px;
            background-color: white;
            color: white;
            box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            animation: dot-typing 1.5s infinite linear;
          }

          @keyframes dot-typing {
            0% {
              box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            }
            16.667% {
              box-shadow: 9984px -10px 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            }
            33.333% {
              box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            }
            50% {
              box-shadow: 9984px 0 0 0 white, 9999px -10px 0 0 white, 10014px 0 0 0 white;
            }
            66.667% {
              box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            }
            83.333% {
              box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px -10px 0 0 white;
            }
            100% {
              box-shadow: 9984px 0 0 0 white, 9999px 0 0 0 white, 10014px 0 0 0 white;
            }
          }
          
          /* Markdown styling */
          .markdown-content h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content h3 {
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content p {
            margin-bottom: 0.5rem;
          }
          
          .markdown-content ul {
            list-style-type: disc;
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content ol {
            list-style-type: decimal;
            margin-left: 1.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content li {
            margin-bottom: 0.25rem;
          }
          
          .markdown-content a {
            color: #3498db;
            text-decoration: underline;
          }
          
          .markdown-content code {
            font-family: monospace;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.1rem 0.2rem;
            border-radius: 3px;
          }
          
          .markdown-content pre {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.5rem;
            border-radius: 5px;
            overflow-x: auto;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content blockquote {
            border-left: 3px solid #e67e22;
            padding-left: 0.5rem;
            margin-left: 0.5rem;
            font-style: italic;
          }
          
          .markdown-content table {
            border-collapse: collapse;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content th, .markdown-content td {
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.5rem;
          }
          
          .markdown-content th {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    );
  }
}

export default AIAssistant;

export const displayAIAssistant = () => {
  return <AIAssistant />;
};
