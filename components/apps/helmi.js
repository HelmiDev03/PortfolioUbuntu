import React, { Component } from "react";
import ReactGA from "react-ga";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedinIn, faGithub, faXTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { SiLeetcode } from 'react-icons/si';
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"

export class AboutHelmi extends Component {
  constructor() {
    super();
    this.screens = {};
    this.state = {
      screen: () => { },
      active_screen: "about", // by default 'about' screen is active
      navbar: false,
    };
  }

  componentDidMount() {
    this.screens = {
      about: <About />,
      education: <Education />,
      skills: <Skills />,
      projects: <Projects />,
      resume: <Resume />,
      thoughts: <Thoughts />,
    };

    let lastVisitedScreen = localStorage.getItem("about-section");
    if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
      lastVisitedScreen = "about";
    }

    // focus last visited screen
    this.changeScreen(document.getElementById(lastVisitedScreen));
  }

  changeScreen = (e) => {
    const screen = e.id || e.target.id;

    // store this state
    localStorage.setItem("about-section", screen);

    // google analytics
    ReactGA.pageview(`/${screen}`);

    this.setState({
      screen: this.screens[screen],
      active_screen: screen,
    });
  };

  showNavBar = () => {
    this.setState({ navbar: !this.state.navbar });
  };

  renderNavLinks = () => {
    return (
      <>
        <div
          id="about"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "about"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="about Helmi"
            src="./themes/Yaru/status/about.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
        </div>
        <div
          id="education"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "education"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="Helmi' education"
            src="./themes/Yaru/status/education.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
        </div>
        <div
          id="skills"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "skills"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="Helmi' skills"
            src="./themes/Yaru/status/skills.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Skills</span>
        </div>
        <div
          id="projects"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "projects"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="Helmi' projects"
            src="./themes/Yaru/status/projects.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
        </div>
        <div
          id="resume"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "resume"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="Helmi's resume"
            src="./themes/Yaru/status/download.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
        </div>
        <div
          id="thoughts"
          tabIndex="0"
          onFocus={this.changeScreen}
          className={
            (this.state.active_screen === "thoughts"
              ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95"
              : " hover:bg-gray-50 hover:bg-opacity-5 ") +
            " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"
          }
        >
          <img
            className=" w-3 md:w-4"
            alt="Helmi's thoughts"
            src="./themes/Yaru/status/thoughts.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Thoughts</span>
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
        <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
          {this.renderNavLinks()}
        </div>
        <div
          onClick={this.showNavBar}
          className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1"
        >
          <div className=" w-3.5 border-t border-white"></div>
          <div
            className=" w-3.5 border-t border-white"
            style={{ marginTop: "2pt", marginBottom: "2pt" }}
          ></div>
          <div className=" w-3.5 border-t border-white"></div>
          <div
            className={
              (this.state.navbar
                ? " visible animateShow z-30 "
                : " invisible ") +
              " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"
            }
          >
            {this.renderNavLinks()}
          </div>
        </div>
        <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
          {this.state.screen}
        </div>
      </div>
    );
  }
}

export default AboutHelmi;

export const displayAboutHelmi = () => {
  return <AboutHelmi />;
};

function About() {
  return (
    <>
      <div className="w-20 md:w-28 my-4 bg-white rounded-full">
        <img
          className="w-full"
          src="./images/logos/meee.jpeg"
          alt="helmi Logo"
        />
      </div>
      <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
        <div>
          <span className="font-bold"> Helmi Lakhder</span>
        </div>
        <div className="font-normal ml-1">
          I'm a{" "}
          <span className="text-pink-600 font-bold">Future Tech Pioneer</span>
        </div>
        <div className="text-xs md:text-sm font-medium text-gray-300 mt-2 tracking-wide">
          AI & Software Engineer | LeetCode Master | Turning research into production-ready systems
        </div>
      </div>
      <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
        <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
        <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
      </div>
      <ul className=" mt-4 mb-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
        <li className=" list-pc">
          Hit me up{" "}
          <a className="text-underline" href="mailto:helmilakhder@gmail.com">
            <u>helmilakhder@gmail.com</u>
          </a>
        </li>
        <li className=" list-phone mt-2">
          WhatsApp me{" "}
          <a className="text-underline" href="https://wa.me/21690217664" target="_blank" rel="noreferrer noopener">
            <u>+216 90 217 664</u>
          </a>
        </li>

        <li className="list-none mt-4">
          <a href="https://www.helmiblog.engineer" target="_blank" rel="noreferrer" className="flex w-full items-center p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded shadow-md transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center justify-center w-10 h-10 bg-ub-orange rounded-full text-white mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-base">Visit My Blog</span>
              <span className="text-xs text-gray-500">helmiblog.engineer</span>
            </div>
            <div className="ml-auto text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
        </li>

        <li style={{ marginTop: "2.2rem", display: 'flex', justifyContent: 'center' }} >
          <a href="https://github.com/HelmiDev03" style={{ marginRight: "1rem", color: "#fff", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
          <a href="https://www.linkedin.com/in/helmipl/?originalSubdomain=tn" style={{ marginRight: "1rem", color: "#0077b5", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
          </a>
          <a href="https://twitter.com/Helmi0128" style={{ marginRight: "1rem", color: "#fff", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </a>
          <a href="https://www.instagram.com/theneongeek/" style={{ marginRight: "1rem", color: "#E1306C", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a href="https://wa.me/21690217664" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp" style={{ marginRight: "1rem", color: "#25D366", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>


          <a href="https://leetcode.com/HelmiDev/" style={{ marginRight: "1rem", marginTop: "-0.1rem", color: "#FFA116", fontWeight: "bold" }}>
            <SiLeetcode size="1.5em" />
          </a>







        </li>
      </ul>
    </>
  );
}
function Education() {
  return (
    <>
      <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Education
        <div className="absolute pt-px bg-white mt-px top-full w-full">
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
        </div>
      </div>
      <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
        <li className="list-disc">
          <div className=" text-lg md:text-xl text-left font-bold leading-tight">
            Higher Institute of Information Technologies and Communications - ISTIC
          </div>
          <div className=" text-sm text-gray-400 mt-0.5">September 2021 - May 2024</div>

          <div className="text-sm text-gray-300 font-bold mt-1">

            Bachelor Degree in IOT and Embedded Systems
          </div>
          <div className="text-sm text-gray-300 font-bold mt-1">

            2x Major De Promotion 2021/2022 & 2022/2023
          </div>
        </li>
        <li className="list-disc mt-2">
          <div className=" text-lg md:text-xl text-left font-bold leading-tight">
            National Institute of Applied Sciences and Technology - INSAT
          </div>
          <div className=" text-sm text-gray-400 mt-0.5">September 2024 - Present</div>

          <div className="text-sm text-gray-300 font-bold mt-1">

            ICT Engineering


          </div>
        </li>
      </ul>
    </>
  );
}




function Skills() {
  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "JavaScript", badge: "https://img.shields.io/badge/-JavaScript-F7DF1C?style=flat&logo=javascript&logoColor=black" },
        { name: "TypeScript", badge: "https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" },
        { name: "Python", badge: "https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white" },
        { name: "C++", badge: "https://img.shields.io/badge/-C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white" },
        { name: "C", badge: "https://img.shields.io/badge/-C-00599C?style=flat&logo=c&logoColor=white" },
        { name: "SQL", badge: "https://img.shields.io/badge/-SQL-4479A1?style=flat&logo=mysql&logoColor=white" },
        { name: "VHDL", badge: "https://img.shields.io/badge/-VHDL-003366?style=flat&logo=microchip&logoColor=white" },
        { name: "Dart", badge: "https://img.shields.io/badge/-Dart-00BFFF?style=flat&logo=dart&logoColor=white" },
        { name: "HTML5", badge: "https://img.shields.io/badge/-HTML5-E44D27?style=flat&logo=html5&logoColor=white" },
        { name: "CSS3", badge: "https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React.js", badge: "https://img.shields.io/badge/-React.js-61DAFB?style=flat&logo=react&logoColor=black" },
        { name: "Next.js", badge: "https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white" },
        { name: "Angular", badge: "https://img.shields.io/badge/-Angular-DD0031?style=flat&logo=angular&logoColor=white" },
        { name: "Nest.js", badge: "https://img.shields.io/badge/-Nest.js-E0234E?style=flat&logo=nestjs&logoColor=white" },
        { name: "Express.js", badge: "https://img.shields.io/badge/-Express.js-000000?style=flat&logo=express&logoColor=white" },
        { name: "Django", badge: "https://img.shields.io/badge/-Django-092E20?style=flat&logo=django&logoColor=white" },
        { name: "FastAPI", badge: "https://img.shields.io/badge/-FastAPI-009688?style=flat&logo=fastapi&logoColor=white" },
        { name: "Spring Boot", badge: "https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white" },
        { name: "Flutter", badge: "https://img.shields.io/badge/-Flutter-02569B?style=flat&logo=flutter&logoColor=white" },
        { name: "Redux", badge: "https://img.shields.io/badge/-Redux-764ABC?style=flat&logo=redux&logoColor=white" },
        { name: "Tailwind CSS", badge: "https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" },
        { name: "Bootstrap", badge: "https://img.shields.io/badge/-Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white" },
      ],
    },
    {
      title: "Databases",
      skills: [
        { name: "MySQL", badge: "https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white" },
        { name: "PostgreSQL", badge: "https://img.shields.io/badge/-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white" },
        { name: "SQL Server", badge: "https://img.shields.io/badge/-SQL_Server-CC292B?style=flat&logo=microsoftsqlserver&logoColor=white" },
        { name: "MongoDB", badge: "https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" },
        { name: "InfluxDB", badge: "https://img.shields.io/badge/-InfluxDB-22ADF6?style=flat&logo=influxdb&logoColor=white" },
        { name: "Neo4j", badge: "https://img.shields.io/badge/-Neo4j-008CC1?style=flat&logo=neo4j&logoColor=white" },
        { name: "Firebase", badge: "https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=black" },
      ],
    },
    {
      title: "ML & AI",
      skills: [
        { name: "Machine Learning", badge: "https://img.shields.io/badge/-Machine_Learning-FF6F00?style=flat&logo=scikit-learn&logoColor=white" },
        { name: "Deep Learning", badge: "https://img.shields.io/badge/-Deep_Learning-EE4C2C?style=flat&logo=pytorch&logoColor=white" },
        { name: "Transformers", badge: "https://img.shields.io/badge/-Transformers-FFD21E?style=flat&logo=huggingface&logoColor=black" },
        { name: "LLMs", badge: "https://img.shields.io/badge/-LLMs-00A67E?style=flat&logo=openai&logoColor=white" },
        { name: "RAG", badge: "https://img.shields.io/badge/-RAG-412991?style=flat&logo=databricks&logoColor=white" },
        { name: "Embeddings", badge: "https://img.shields.io/badge/-Embeddings-0052CC?style=flat&logo=meta&logoColor=white" },
        { name: "PyTorch", badge: "https://img.shields.io/badge/-PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white" },
        { name: "LangGraph", badge: "https://img.shields.io/badge/-LangGraph-4B275F?style=flat&logo=graphql&logoColor=white" },
        { name: "MCP", badge: "https://img.shields.io/badge/-MCP-10A37F?style=flat&logo=openai&logoColor=white" },
      ],
    },
    {
      title: "IoT & Embedded",
      skills: [
        { name: "ESP32", badge: "https://img.shields.io/badge/-ESP32-E7352C?style=flat&logo=espressif&logoColor=white" },
        { name: "STM32", badge: "https://img.shields.io/badge/-STM32-03234C?style=flat&logo=stmicroelectronics&logoColor=white" },
        { name: "PIC18", badge: "https://img.shields.io/badge/-PIC18-FF0000?style=flat&logo=microchip&logoColor=white" },
        { name: "PSoC", badge: "https://img.shields.io/badge/-PSoC-00539C?style=flat&logo=cypress&logoColor=white" },
        { name: "FreeRTOS", badge: "https://img.shields.io/badge/-FreeRTOS-162832?style=flat&logo=freebsd&logoColor=white" },
        { name: "Node-RED", badge: "https://img.shields.io/badge/-Node--RED-8F0000?style=flat&logo=node-red&logoColor=white" },
        { name: "MQTT", badge: "https://img.shields.io/badge/-MQTT-660066?style=flat&logo=mqtt&logoColor=white" },
        { name: "LabVIEW", badge: "https://img.shields.io/badge/-LabVIEW-FFD700?style=flat&logo=nationalinstruments&logoColor=black" },
      ],
    },
    {
      title: "Big Data",
      skills: [
        { name: "Apache Hadoop", badge: "https://img.shields.io/badge/-Apache_Hadoop-66CCFF?style=flat&logo=apachehadoop&logoColor=black" },
        { name: "Apache Spark", badge: "https://img.shields.io/badge/-Apache_Spark-E35A4B?style=flat&logo=apachespark&logoColor=white" },
        { name: "BigSQL", badge: "https://img.shields.io/badge/-BigSQL-05495C?style=flat&logo=ibm&logoColor=white" },
        { name: "Cloudera", badge: "https://img.shields.io/badge/-Cloudera-EB3C00?style=flat&logo=apache&logoColor=white" },
      ],
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "GCP", badge: "https://img.shields.io/badge/-GCP-4285F4?style=flat&logo=googlecloud&logoColor=white" },
        { name: "Microsoft Azure", badge: "https://img.shields.io/badge/-Microsoft_Azure-0089D6?style=flat&logo=microsoftazure&logoColor=white" },
        { name: "AWS", badge: "https://img.shields.io/badge/-AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white" },
        { name: "Docker", badge: "https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white" },
        { name: "Kubernetes", badge: "https://img.shields.io/badge/-Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white" },
        { name: "Apache Airflow", badge: "https://img.shields.io/badge/-Apache_Airflow-017CEE?style=flat&logo=apacheairflow&logoColor=white" },
        { name: "Ansible", badge: "https://img.shields.io/badge/-Ansible-EE0000?style=flat&logo=ansible&logoColor=white" },
        { name: "Prometheus", badge: "https://img.shields.io/badge/-Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white" },
        { name: "Grafana", badge: "https://img.shields.io/badge/-Grafana-F46800?style=flat&logo=grafana&logoColor=white" },
        { name: "Ubuntu", badge: "https://img.shields.io/badge/-Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white" },
      ],
    },
    {
      title: "Tools & Practices",
      skills: [
        { name: "Git", badge: "https://img.shields.io/badge/-Git-F05032?style=flat&logo=git&logoColor=white" },
        { name: "GitHub", badge: "https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white" },
        { name: "GitHub Actions", badge: "https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white" },
        { name: "CI/CD", badge: "https://img.shields.io/badge/-CI%2FCD-2088FF?style=flat&logo=githubactions&logoColor=white" },
        { name: "REST APIs", badge: "https://img.shields.io/badge/-REST_APIs-0055DA?style=flat&logo=fastapi&logoColor=white" },
        { name: "GraphQL", badge: "https://img.shields.io/badge/-GraphQL-E10098?style=flat&logo=graphql&logoColor=white" },
        { name: "Microservices", badge: "https://img.shields.io/badge/-Microservices-8E44AD?style=flat&logo=docker&logoColor=white" },
        { name: "Pytest", badge: "https://img.shields.io/badge/-Pytest-0A9EDC?style=flat&logo=pytest&logoColor=white" },
        { name: "Jest", badge: "https://img.shields.io/badge/-Jest-C21325?style=flat&logo=jest&logoColor=white" },
        { name: "Selenium", badge: "https://img.shields.io/badge/-Selenium-43B02A?style=flat&logo=selenium&logoColor=white" },
        { name: "Agile/Scrum", badge: "https://img.shields.io/badge/-Agile%2FScrum-0052CC?style=flat&logo=jira&logoColor=white" },
        { name: "ELT", badge: "https://img.shields.io/badge/-ELT-FF6600?style=flat&logo=databricks&logoColor=white" },
      ],
    },
  ];

  return (
    <>
      <div className="font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Technical Skills
        <div className="absolute pt-px bg-white mt-px top-full w-full">
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
        </div>
      </div>
      <ul className="tracking-tight text-sm md:text-base w-10/12 emoji-list">
        <li className="list-arrow text-sm md:text-base mt-2 leading-tight tracking-tight">
          <div>Technical expertise across AI, full-stack, embedded systems & cloud engineering:</div>
        </li>
      </ul>
      <div className="w-full md:w-11/12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-2 mb-6">
        {skillCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-3 bg-white bg-opacity-5 rounded border border-gray-50 border-opacity-10 hover:border-opacity-20 transition-all"
          >
            <div className="text-sm md:text-base font-bold text-ub-orange mb-2 border-b border-gray-500 border-opacity-20 pb-1">
              {cat.title}
            </div>
            <div className="flex flex-wrap items-center justify-start gap-1">
              {cat.skills.map((skill, sIdx) => (
                <img
                  key={sIdx}
                  className="m-0.5 hover:scale-105 transition-transform duration-150"
                  src={skill.badge}
                  alt={skill.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Projects() {
  const project_list = [
    {
      name: "Automated AI System for Quran Reels Generation",
      date: "January 2026",
      link: "https://github.com/HelmiDev03/AutomatedAISystemQuranReelsGeneration",
      description: [
        "Engineered an automated AI system for generating short-form Quran Reels with synchronized recitation audio, dynamic Arabic typography & translation subtitles, and background visual synthesis.",
        "Integrated AI audio processing, automated Whisper timestamp alignment, customizable visual overlay templates, and cloud FFmpeg video rendering.",
      ],
      domains: [
        "Python",
        "FFmpeg",
        "Whisper",
        "AI Audio Processing",
        "FastAPI",
        "Automation",
      ],
    },
    {
      name: "AI-Driven Autonomous Security Drone",
      date: "June 2026",
      link: "https://github.com/HelmiDev03",
      description: [
        "Built a custom surveillance drone covering bare-metal ESP32 flight-controller firmware (PID control, complementary filter, FreeRTOS) and an Orange Pi edge-AI stack running real-time YOLOv8n threat/fire detection, ArcFace face re-identification, and monocular depth estimation.",
        "Designed a real-time telemetry pipeline over Wi-Fi (UDP/WebSocket) to a Flutter ground-control app, achieving low-latency live video, detection overlays, and on-device flight control at the edge.",
      ],
      domains: [
        "ESP32",
        "FreeRTOS",
        "Orange Pi",
        "YOLOv8",
        "ArcFace",
        "Depth-Anything v2",
        "MQTT",
        "Python",
        "OpenCV",
        "Flutter",
      ],
    },
    {
      name: "Tunisia Job Recommendation System",
      date: "December 2025",
      link: "https://github.com/HelmiDev03/Tunisia-job-recommendation-system",
      description: [
        "Built an automated, cloud-deployed system that scrapes LinkedIn job postings via scheduled Airflow DAGs and matches parsed CVs to roles using cosine-similarity semantic search over all-MiniLM-L6-v2 embeddings.",
        "Integrated Llama 3.1 for CV parsing and skill extraction, exposing results through a FastAPI REST backend and Next.js frontend deployed on Google Cloud Run.",
      ],
      domains: [
        "FastAPI",
        "Next.js",
        "Apache Airflow",
        "PyTorch",
        "all-MiniLM-L6-v2",
        "Llama 3.1",
        "Google Cloud Run",
      ],
    },
    {
      name: "Trading Company Website with AI Integration",
      date: "August 2025",
      link: "https://github.com/HelmiDev03",
      description: [
        "Developed a comprehensive website for a trading company in Dubai during their growth phase. The platform features a fine-tuned Gemini AI model customized for the company's specific needs as an FX broker.",
        "The AI assistant helps clients with market analysis, trading strategies, and personalized investment recommendations based on risk profile and market conditions.",
      ],
      domains: [
        "Next.js",
        "Gemini",
        "Fine-Tuning",
        "TensorFlow",
      ],
    },
    {
      name: "E-commerce Platform for IPTV Provider",
      date: "June 2025",
      link: "https://pro-sat-reciever.vercel.app/",
      description: [
        "Designed and implemented a full-featured e-commerce website for an IPTV service provider. The platform includes a recommendation system suggesting content based on user viewing habits and secure payment gateway integration.",
      ],
      domains: [
        "Next.js",
        "MongoDB",
        "ML Recommendation Model",
        "Payment Gateway Integration",
        "Redux",
      ],
    },
    {
      name: "Classification of Cardiac Anomalies from ECG Signals",
      date: "May 2025",
      link: "https://github.com/HelmiDev03/Classification-of-Cardiac-Anomalies-from-ECG-Signals",
      description: [
        "Developed a machine learning system classifying cardiac anomalies from ECG signals on the MIT-BIH Arrhythmia dataset, covering signal preprocessing, feature extraction, and comparative model training.",
        "Served trained models through a FastAPI backend and Next.js interface for real-time ECG classification.",
      ],
      domains: [
        "Next.js",
        "FastAPI",
        "Random Forest",
        "SVM",
        "KNN",
        "Decision Tree",
        "MIT-BIH Arrhythmia",
      ],
    },
    {
      name: "Supermarket Management System (Freelance)",
      date: "September 2024",
      link: "https://github.com/lmahdy/Management-System",
      description: [
        "Web-based supermarket management system for local business owners to manage sales, track inventory, streamline client management through customer databases, and track supplier orders.",
      ],
      domains: [
        "Django",
        "PostgreSQL",
      ],
    },
    {
      name: "Enterprise Workforce & HR Management ERP SaaS",
      date: "May 2024",
      link: "https://github.com/HelmiDev03/Client",
      description: [
        "End-of-studies SaaS solution co-developed for Novencia Group to streamline workforce management and attendance ERP modules, flexible time-off tracking, and multi-tiered organizational hierarchy schemas.",
      ],
      domains: [
        "Next.js",
        "Express.js",
        "Flutter",
        "Redux",
        "MongoDB",
        "Tailwind CSS",
      ],
    },
    {
      name: "Cho3la (Flame & Gas Detection System)",
      date: "December 2023",
      link: "https://github.com/HelmiDev03",
      description: [
        "Built a flame and gas detection system on ESP8266 NodeMCU with real-time MQTT monitoring to a Node-RED dashboard and instant Telegram alerts.",
      ],
      domains: [
        "ESP8266",
        "NodeMCU",
        "MQTT",
        "Node-RED",
        "Telegram API",
      ],
    },
    {
      name: "Insurance Agency Management System",
      date: "August 2023",
      link: "https://github.com/HelmiDev03/InsuranceAgencyManagementSystem",
      description: [
        "Internal insurance platform developed for MAE Assurances with face-recognition authentication to streamline operational workflows and improve user access management.",
      ],
      domains: [
        "Python",
        "Django",
        "PostgreSQL",
        "Face Recognition",
        "Bootstrap",
        "Chart.js",
        "PrismJs",
      ],
    },
    {
      name: "HelmiPredico-V2 (Healthcare & Disease Prediction)",
      date: "April 2023",
      link: "https://github.com/HelmiDev03/HelmiPredico",
      description: [
        "Hospital Management System and General Disease Prediction based on patient symptoms using machine learning models.",
      ],
      domains: [
        "Python",
        "Django",
        "Machine Learning",
        "PostgreSQL",
        "Render",
        "Cloudinary",
      ],
    },
    {
      name: "HelmiPredico-V1 (Telehealth Mobile App)",
      date: "April 2023",
      link: "https://github.com/HelmiDev03/FireBaseAuth",
      description: [
        "Mobile application designed to simplify and automate interactions between doctors and patients for efficient healthcare management.",
      ],
      domains: [
        "Flutter",
        "Firebase",
      ],
    },
    {
      name: "HMKSOCIALHUB (Social Networking Platform)",
      date: "March 2023",
      link: "https://github.com/HelmiDev03/Social-Media-Web-App",
      description: [
        "Social networking platform designed to connect individuals, featuring mandatory registration and personalized user feeds.",
      ],
      domains: [
        "Python",
        "Django",
        "PostgreSQL",
        "Render",
        "Cloudinary",
      ],
    },
  ];

  const tag_colors = {
    javascript: "yellow-300",
    firebase: "red-600",
    firestore: "red-500",
    "firebase auth": "red-400",
    flutter: "blue-400",
    dart: "blue-500",
    html5: "pink-600",
    sass: "pink-400",
    tensorflow: "yellow-600",
    django: "green-600",
    python: "green-200",
    tailwindcss: "blue-300",
    "next.js": "purple-600",
    fastapi: "green-400",
    pytorch: "red-500",
    mongodb: "green-500",
    postgresql: "blue-600",
    "express.js": "gray-300",
    redux: "purple-400",
    opencv: "red-400",
    esp32: "yellow-500",
    freertos: "blue-300",
    mqtt: "purple-300",
    "apache airflow": "blue-500",
    "google cloud run": "blue-400",
    "llama 3.1": "purple-500",
  };

  return (
    <>
      <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Projects
        <div className="absolute pt-px bg-white mt-px top-full w-full">
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
        </div>
      </div>

      {project_list.map((project, index) => {
        let repoUser = "HelmiDev03";
        let repoName = "";
        let showStar = false;

        if (project.link && project.link.includes("github.com")) {
          const parts = project.link.replace("https://github.com/", "").split("/").filter(Boolean);
          if (parts.length >= 2) {
            repoUser = parts[0];
            repoName = parts[1];
            showStar = true;
          }
        }

        return (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="flex w-full flex-col px-4"
          >
            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex justify-center items-center">
                  <div className=" text-base md:text-lg mr-2">
                    {project.name.toUpperCase()}
                  </div>
                  {showStar && (
                    <iframe
                      src={`https://ghbtns.com/github-btn.html?user=${repoUser}&repo=${repoName}&type=star&count=true`}
                      frameBorder="0"
                      scrolling="0"
                      width="150"
                      height="20"
                      title={project.name.toLowerCase() + "-star"}
                    ></iframe>
                  )}
                </div>
                <div className="text-gray-300 font-light text-sm">
                  {project.date}
                </div>
              </div>
              <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                {project.description.map((desc, index) => {
                  return (
                    <li key={index} className="list-disc mt-1 text-gray-100">
                      {desc}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap items-start justify-start text-xs py-2">
                {project.domains
                  ? project.domains.map((domain, index) => {
                    const colorKey = tag_colors[domain.toLowerCase()] || "gray-300";
                    const borderColorClass = `border-${colorKey}`;
                    const textColorClass = `text-${colorKey}`;

                    return (
                      <span
                        key={index}
                        className={`px-1.5 py-0.5 w-max border ${borderColorClass} ${textColorClass} m-1 rounded-full`}
                      >
                        {domain}
                      </span>
                    );
                  })
                  : null}
              </div>
            </div>
          </a>
        );
      })}
    </>
  );
}
function Resume() {
  return (
    <iframe
      className="h-full w-full"
      src="./files/cv.pdf"
      title="Helmi Lakhder resume"
      frameBorder="0"
    ></iframe>
  );
}


function Thoughts() {
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeProjectIndex, setActiveProjectIndex] = useState(null); // To track which thought has the active carousel
  // Lock/Unlock state and modal for password
  const [unlockedThoughts, setUnlockedThoughts] = useState(new Set());
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingUnlockIndex, setPendingUnlockIndex] = useState(null);

  // Generate a secret but enticing teaser based on context (title)
  const getTeaser = (title = "") => {
    const t = String(title).toLowerCase();
    if (t.includes("dream")) return "A dreamy reflection ✨";
    if (t.includes("dob") || t.includes("gone") || t.includes("loss") || t.includes("memory")) return "A heartfelt memory 💖";
    if (t.includes("project") || t.includes("build") || t.includes("code")) return "A builder's insight 🔧";
    if (t.includes("life") || t.includes("day") || t.includes("today")) return "A slice of life 🍃";
    return "A personal note worth reading ✨";
  };

  const project_list = [
    {
      title: "Dob is gone",
      date: "November 2024",
      description: [
        "I never truly understood the bond people have with cats, not until she became a part of my life. I wasn’t one to like cats by nature, but somehow, over two years, she became more than just a pet—she was a family member. We shared everything with her, from the simplest moments to the most intimate ones.\n\nOne morning, like any other, I opened the door to let her out, just as I always did. She’d usually be gone for 15 minutes before returning, but this time, she didn’t come back. Hours passed, and with each minute, I felt a growing sense of dread. Finally, I found her, lifeless. A piece of my soul died with her that day, and the world will never feel the same again.\n\nIt turned out she had ingested something toxic, leading to her sudden and heartbreaking death. Now, every corner of the house reminds me of her. Each time I open the jar, I can almost feel her waiting for me, expecting to be fed. Every time I eat in my room, I can feel her presence behind the door, waiting for me to open it and share with her.\n\nBut it’s not just the places—it's the feeling of her. I still feel her paws brushing against my feet, like she always did , I can still feel her presence in my neck  , she always loved being there, quietly resting, content in her spot . I hear her voice in the back of my mind, and I can almost smell her sweet scent, something I never noticed with other cats. She wasn’t just a pet; she had this unique charm, a warmth that made her irreplaceable.\n\nI remember the last time I took her to the vet, hoping to keep her safe with a simple vaccine. But it was too late. Her time was cut short far too soon. \"Dob\" is gone, and with her, part of me is gone too. I will never be the same again. Her absence is a hole in my heart that no one and nothing can fill."
      ],
      images: [
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797379/1731796986937_nhmhh3.jpg",
        "https://res.cloudinary.com/dmvxysqvl/video/upload/dabdoub_klcaaw.mp4?_s=vp-2.1.0",
        "https://res.cloudinary.com/dmvxysqvl/video/upload/468564744-9049975895045288-77634_bgt9fm.mp4?_s=vp-2.1.0",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1734172248/dob_bqdsah.png",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731946719/IMG_20241118_171742_gzoucs.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1732492285/IMG_20231028_080017_cdzjnx.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731946719/IMG_20241118_171758_xin0i1.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797379/1731796986946_na78sr.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1732834091/IMG_20230905_180040_xmkocq.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1732834090/IMG_20230905_180201_qqoezm.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1680561729/media/post_images/6cacd6a4-7d9e-48d7-bca3-1577d0f0370d_qkeeeh.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797380/1731796986971_p1m5l9.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797379/1731796986959_bjqid7.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797405/1731796987047_x8i0dh.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797404/1731796987027_t5dpdg.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797469/IMG_20240310_200406_xsnevv.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797469/IMG_20231228_194946_hs6a1e.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797467/IMG_20231223_215435_scxb2j.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797464/IMG_20231107_183045_o0dno0.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797463/IMG_20231002_164222_rs2kwe.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797442/IMG_20230905_180201_r5hwk2.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797419/IMG_20230905_180040_iwnh10.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797416/1731796987086_m5uxwu.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797407/1731796987055_bgluho.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797407/1731796987062_amnbxp.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797405/1731796987047_x8i0dh.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797397/1731796987020_vpv6ac.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797391/1731796987011_icssge.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731797389/1731796986990_sko8fw.jpg",
      ]
    },

    {
      title: "Living the dream",
      date: "March 2023",
      description: [
        "The fake dream was so nice that I didn't want to wake up. I was living in a world where everything was perfect, where I was happy, where I was loved, where I was successful.  But then I woke up, and I realized that it was all just a dream.",
      ],
      images: [
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1679715989/media/post_images/866bd401-417e-4796-a394-871e5651362e_jdvbll.png",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1679718962/media/post_images/626d25b2-58bd-4744-886a-9c5c6dd82391_fxunza.png",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1679674303/media/profile_images/amomulheres_Create_a_draw_dont_forgot_to_put_fails_in_lines_lik_845781b6-96a9-4643-9a_vrff3s.png",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1679866568/media/post_images/e0de3058-9f39-4c56-ba75-90b3752aa4a4_mxzdjn.jpg",
        "https://res.cloudinary.com/dmvxysqvl/image/upload/v1681430950/media/post_images/096bb599-c3cf-4923-994d-7623b4db9ae0_jc0ged.jpg"

      ],
    },

  ];

  const toggleCarousel = (images, index) => {
    setSelectedImages(
      images.map((image) => {
        const isVideo = image.includes(".mp4") || image.includes(".webm");
        return isVideo
          ? {
            original: image,
            thumbnail: "https://res.cloudinary.com/dmvxysqvl/image/upload/v1731939026/ddddd_hj6yhv.png",
            renderItem: () => (
              <video className="translate-x-1/2" controls style={{ width: "50%" }}>
                <source src={image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ),
          }
          : {
            original: image,
            thumbnail: image,
          };
      })
    );
    setActiveProjectIndex(index === activeProjectIndex ? null : index); // Toggle the carousel for the current thought
  };


  const closeCarousel = () => {
    setActiveProjectIndex(null); // Hide the carousel
  };

  const openUnlockModal = (index) => {
    setPendingUnlockIndex(index);
    setPasswordInput("");
    setPasswordError("");
    setPasswordModalOpen(true);
  };

  const cancelUnlock = () => {
    setPasswordModalOpen(false);
    setPasswordInput("");
    setPasswordError("");
    setPendingUnlockIndex(null);
  };

  const confirmUnlock = () => {
    const expected = process.env.NEXT_PUBLIC_THOUGHTS_PASSWORD || "";
    if (!expected) {
      setPasswordError("Password not configured. Set NEXT_PUBLIC_THOUGHTS_PASSWORD in .env.local.");
      return;
    }
    if (passwordInput === expected) {
      setUnlockedThoughts((prev) => {
        const next = new Set(prev);
        if (pendingUnlockIndex !== null) next.add(pendingUnlockIndex);
        return next;
      });
      setPasswordModalOpen(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Try again.");
    }
  };

  return (
    <>
      <div className="font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Thoughts
        <div className="absolute pt-px bg-white mt-px top-full w-full">
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
        </div>
      </div>

      {project_list.map((thought, index) => {
        const isCarouselVisible = activeProjectIndex === index; // Check if this thought's carousel is visible
        const isUnlocked = unlockedThoughts.has(index);
        return (
          <div key={index} className="flex w-full flex-col px-4">
            <div className="relative w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded">
              {/* Overlay when locked */}
              {!isUnlocked && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded cursor-pointer"
                  onClick={() => openUnlockModal(index)}
                >
                  <div className="text-sm md:text-base font-bold text-white">Locked</div>
                  <div className="text-xs text-gray-200 mt-1">Click to unlock</div>
                  <div className="text-xs md:text-sm text-gray-100 mt-2 italic px-3 text-center">
                    {getTeaser(thought.title)}
                  </div>
                </div>
              )}

              {/* Blurred content when locked */}
              <div className={isUnlocked ? "" : "filter blur-md pointer-events-none select-none"}>
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex justify-center items-center">
                    <div className="text-base md:text-lg mr-2">{thought.title?.toUpperCase()}</div>
                  </div>
                  <div className="text-gray-300 font-light text-sm">{thought.date}</div>
                </div>
                <ul className="tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                  {thought.description.map((desc, index) => (
                    <li key={index} className="list-disc mt-1 text-gray-100">
                      {desc}
                    </li>
                  ))}
                </ul>

                {/* Button to toggle carousel visibility */}
                <button
                  onClick={() => (isUnlocked ? toggleCarousel(thought.images, index) : openUnlockModal(index))}
                  className="mt-4 px-4 py-2 text-pink-600 font-bold rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer focus:outline-none"
                >
                  {isUnlocked ? (isCarouselVisible ? "Hide Attachment" : "See Attachment") : "Unlock to view"}
                </button>
              </div>
            </div>

            {/* Carousel for the current thought (only when unlocked) */}
            {isUnlocked && isCarouselVisible && (
              <div className="relative">
                <ImageGallery items={selectedImages} />
              </div>
            )}
          </div>
        );
      })}

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={cancelUnlock}></div>
          <div className="relative z-10 w-11/12 max-w-sm bg-ub-grey border border-gray-50 border-opacity-20 rounded p-4 shadow-lg">
            <div className="text-lg font-bold mb-2">Enter password</div>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-ub-cool-grey border border-gray-50 border-opacity-20 outline-none focus:border-pink-600"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmUnlock(); }}
              autoFocus
            />
            {passwordError ? (
              <div className="text-red-500 text-xs mt-1">{passwordError}</div>
            ) : null}
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={cancelUnlock}
                className="px-3 py-1 rounded bg-gray-600 bg-opacity-40 hover:bg-opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnlock}
                className="px-3 py-1 rounded bg-pink-600 hover:bg-pink-700"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

