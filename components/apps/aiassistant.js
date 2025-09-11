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
          content: "Hello! I'm Helmi's AI Assistant. How can I help you today?",
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
      // Call Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `IMPORTANT INSTRUCTIONS: You are an AI assistant dedicated exclusively to providing information about Helmi Lakhder. 

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
                  - Phone: +216 90-217-664
                  - Location: Tunis, Tunisia
                  - Languages: French, English, Arabic
                  - Website: www.helmi404.me
                  - Social Media: GitHub (@HelmiDev03), LinkedIn (helmipl), Twitter (@Helmi0128), Instagram (@theneongeek), LeetCode (@HelmiDev)
                  
                  EDUCATION:
                  - National Institute of Applied Science and Technology (INSAT) (September 2024 - Present)
                    * ENGINEER's DEGREE, ICT
                  - Higher Institute of Information Technologies and Communications (ISTIC) (September 2021 - May 2024)
                    * B.S. IoT, Embedded Systems
                    * GPA: 4.0/4.0
                    * Valedictorian for the 2021/2022 and 2022/2023 Classes
                  
                  SKILLS:
                  - Languages: JavaScript, TypeScript, Python, C++, C, Dart
                  - Web Technologies: HTML, CSS, Tailwind CSS, Bootstrap
                  - Frameworks & Libraries: React.js, Next.js, Flutter, Express.js, Django, FastAPI, LangGraph, Spring Boot
                  - Databases: PostgreSQL, MySQL, MongoDB
                  - DevOps & Tools: Docker, Node-RED, Apache Airflow, Ansible, Prometheus, Grafana, Selenium, Git
                  - Operating Systems: Ubuntu, Debian, Cloudera
                  
                  EXPERIENCE:
                  - Biolyt AI · Full Stack Data Engineer (July 2025 - August 2025)
                    * Summer Internship (Remote) - Bengaluru South, Karnataka, India
                    * Gained understanding of healthcare business plan, including clinical trials, FDA processes, and biotech operations
                    * Contributed to FastAPI-backed multi-agent system using LangGraph
                    * Managed DAG using Apache Airflow for clinical and regulatory data processing
                    * Technologies: React.js, FastAPI, LangGraph, Apache Airflow, Docker, MongoDB
                  
                  - Novencia Group · Full Stack Developer (February 2024 - May 2024)
                    * End of Studies Internship (On-site) - Montplaisir, Tunis
                    * Developed web and mobile SaaS solution for HR functionalities
                    * Technologies: Next.js, Flutter, Express.js, Redux, MongoDB, Tailwind CSS
                  
                  - MAE Assurances · Back-end Developer (July 2023 - August 2023)
                    * Summer Internship (Hybrid) - Ariana, Tunis
                    * Created platform for insurance domain interactions and transactions
                    * Technologies: Face Recognition, Django, PostgreSQL, Bootstrap, Chart.js, Prism.js
                  
                  Some of PROJECTS(get rest from his github):
                  1. Classification of Cardiac Anomalies from ECG Signals (May 2025)
                     * Machine learning system classifying cardiac anomalies from ECG signals
                     * Trained multiple ML models (Random Forest, SVM, KNN, Decision Tree)
                     * Implemented API with FastAPI and user interface with Next.js
                  
                  2. Cho3la (December 2023)
                     * Flame and gas detection application using ESP8266 NodeMCU with sensors
                     * Data sent to ESP32, published via MQTT to Node-RED dashboard
                     * Real-time visualization and Telegram notifications
                  
                  3. HMKSocialHUB (March 2023)
                     * Social platform built with Django
                     * Features: user interactions, content management, admin controls
                     * Technologies: Django, PostgreSQL, Cloudinary, CI/CD deployment
                  
                  4. End-Of-Study Project (May 2024): SaaS solution for HR functionalities
                  
                  5. Insurance Agency Management System (June 2023): System for home insurance subscription and request handling
                  
                  6. HelmiPredico-V2 (April 2023): Hospital Management System with disease prediction
                  
                  7. HelmiPredico-V1 (April 2023): Mobile app for doctor-patient interactions
                  
                  User query: ${userInput}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        this.setState({
          messages: [
            ...updatedMessages,
            { role: "assistant", content: aiResponse },
          ],
          isLoading: false,
        });
      } else {
        console.error("Invalid response format:", JSON.stringify(data));
        throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = error.message && error.message.includes('Invalid response format') 
        ? 'Sorry, there was an issue with the AI response format. The team has been notified.'
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
        className={`mb-4 ${
          message.role === "user" ? "text-right" : "text-left"
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
          className={`inline-block p-3 rounded-lg ${
            message.role === "user"
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
            placeholder="Ask me about Helmi..."
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
