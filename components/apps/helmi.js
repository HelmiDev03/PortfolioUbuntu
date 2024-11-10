import React, { Component } from "react";
import ReactGA from "react-ga";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { SiLeetcode } from 'react-icons/si';


export class AboutEslam extends Component {
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
            alt="Eslam' education"
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
            alt="eslam' skills"
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
            alt="eslam' projects"
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
            alt="eslam's resume"
            src="./themes/Yaru/status/download.svg"
          />
          <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
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

export default AboutEslam;

export const displayAboutEslam = () => {
  return <AboutEslam />;
};

function About() {
  return (
    <>
      <div className="w-20 md:w-28 my-4 bg-white rounded-full">
        <img
          className="w-full"
          src="./images/logos/ah.jpeg"
          alt="helmi Logo"
        />
      </div>
      <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
        <div>
          <span className="font-bold"> Helmi Lakhder</span>
        </div>
        <div className="font-normal ml-1">
          I'm a{" "}
          <span className="text-pink-600 font-bold">Software Developer</span>
        </div>
      </div>
      <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
        <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
        <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
      </div>
      <ul className=" mt-4 mb-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
        <li className=" list-pc">

          I love building Server Side Logic and Infrastructure ( Hit me up{" "}
          <a className="text-underline" href="mailto:helmilakhder@gmail.com">
            <u>helmilakhder@gmail.com</u>
          </a>{" "}
          )
        </li>

        <li style={{ marginTop: "2.2rem", display: 'flex', justifyContent: 'center' }} >
          <a href="https://github.com/HelmiDev03" style={{ marginRight: "1rem", color: "#fff", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
          <a href="https://www.linkedin.com/in/helmipl/?originalSubdomain=tn" style={{ marginRight: "1rem", color: " #0e76a8 ", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a href="https://twitter.com/Helmi0128" style={{ marginRight: "1rem", color: "#1DA1F2", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a href="https://www.instagram.com/theneongeek/" style={{ marginRight: "1rem", color: "#C13584", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faInstagram} size="lg" />
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
          <div className=" text-sm text-gray-400 mt-0.5">September 2024</div>

          <div className="text-sm text-gray-300 font-bold mt-1">

            ICT Engineering 


          </div>
        </li>
      </ul>
    </>
  );
}




function Skills() {
  return (
    <>
      <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Technical Skills
        <div className="absolute pt-px bg-white mt-px top-full w-full">
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
          <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
        </div>
      </div>
      <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list">

        <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
          <div>Here are my most frequently used</div>
        </li>
      </ul>
      <div className="w-full md:w-10/12 flex mt-4">
        <div className=" text-sm text-center md:text-base w-1/2 font-bold">
          Languages & Tools
        </div>
        <div className=" text-sm text-center md:text-base w-1/2 font-bold">
          Frameworks & Libraries
        </div>
      </div>
      <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
        <div className="px-2 w-1/2">
          <div className="flex flex-wrap justify-center items-start w-full mt-2">
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white"
              alt="Python"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-C-00599C?style=flat&logo=c&logoColor=white"
              alt="C"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white"
              alt="C++"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Dart-00BFFF?style=flat&logo=dart&logoColor=white"
              alt="Dart"
            />


            <img
              className="m-1"
              src="https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A"
              alt="eslam javascript"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white"
              alt="TypeScript"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Redux-764ABC?style=flat&logo=redux&logoColor=white"
              alt="Redux"
            />



            <a
              href="https://www.google.com/search?q=is+html+a+language%3F"
              target="_blank"
              rel="noreferrer"
            >
              <img
                title="yes it's a language!"
                className="m-1"
                src="https://img.shields.io/badge/-HTML5-%23E44D27?style=flat&logo=html5&logoColor=ffffff"
                alt="eslam HTML"
              />
            </a>

            <img
              src="https://img.shields.io/badge/-CSS-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS"
              alt="eslam SASS"
              className="m-1"
            />
            <img
              src="https://img.shields.io/badge/-Git-%23F05032?style=flat&logo=git&logoColor=%23ffffff"
              alt="eslam git"
              className="m-1"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white"
              alt="helmi tailwind"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white"
              alt="helmi bootstrap"
            />
            <img
              src="https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=ffffff"
              alt="eslam firebase"
              className="m-1"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white"
              alt="helmi postgresql"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white"
              alt="helmi mysql"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"
              alt="helmi mongodb"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white"
              alt="Docker"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Apache%20Spark-E35A4B?style=flat&logo=apache-spark&logoColor=white"
              alt="Apache Spark"
            />


            <img
              class="m-1"
              src="https://img.shields.io/badge/-Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white"
              alt="Ubuntu"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Cloudera-EB3C00?style=flat&logo=apache&logoColor=white"
              alt="Cloudera"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Debian-A81D33?style=flat&logo=debian&logoColor=white"
              alt="helmi debian"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Node%20RED-F00?style=flat&logo=node-red&logoColor=white"
              alt="Node-RED"
            />






          </div>
        </div>
        <div className="px-2 flex flex-wrap items-start w-1/2">
          <div className="flex flex-wrap justify-center items-start w-full mt-2">
            <img
              className=" m-1"
              src="https://img.shields.io/badge/-Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)"
              alt="helmi express"
            />
            <img
              className=" m-1"
              src="//img.shields.io/badge/-Django-092E20?style=flat&logo=django&logoColor=white)](https://www.djangoproject.com/"
              alt="helmi django"
            />

            <img
              className="m-1"
              src="https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)"
              alt="helmi next"
            />
            <img
              className="m-1"
              src="https://img.shields.io/badge/-Flutter-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev/)"
              alt="helmi flutter"
            />
            <img
              class="m-1"
              src="https://img.shields.io/badge/-Selenium-43B02A?style=flat&logo=selenium&logoColor=white"
              alt="helmi selenium"
            />

          </div>
        </div>
      </div>
    </>
  );
}

function Projects() {
  const project_list = [
    {
      name: "Freelance Project",
      date: "September 2024",
      link: "https://github.com/lmahdy/Management-System",
      description: [
        "My partner and I are developing a supermarket management system for small business owners in our area. The platform will help them manage sales, track inventory, and generate reports for better financial oversight. It will also streamline client management through a customer database and loyalty programs, while offering tools to efficiently track supplier orders and payments. Our goal is to provide an easy-to-use, web-based solution that empowers local supermarket owners to optimize their operations and improve overall efficiency",
      ],
      domains: [
        "Django",
        "PostgreSQL",
      ],
    },
    {
      name: "End-Of-Study Project",
      date: "May 2024",
      link: "https://github.com/HelmiDev03/Client",
      description: [
        "A SaaS solution to streamline various HR functionalities for companies, offering both generic and personalized features, this solution is supported by a back-office application to monitor and track client activities.",
      ],
      domains: [
        "Nextjs",
        "Expressjs", ,
        "MongoDB",
        "Redux",
        "TailwindCss"
      ],
    },
    {
      name: "Insurance Agency Management System",
      date: "June 2023",
      link: "https://github.com/HelmiDev03/InsuranceAgencyManagementSystem",
      description: [
        "The insurance management system is designed to facilitate and streamline the process of home insurance subscription and request handling. It offers an intuitive and efficient interface for users to submit insurance requests and seamlessly manages the responses for added home insurance requests.",
      ],
      domains: [
        "Html",
        "Bootstrap",
        "Python",
        "Django", ,
        "SQLite3",
        "PrismJs",
        "ChartJs",
        "Face Recognition",
      ],
    },
    {
      name: "HelmiPredico-V2",
      date: "April 2023",
      link: "https://github.com/HelmiDev03/HelmiPredico",
      description: [
        "Hospital Management System and General Disease Prediction based on symptoms provided by patient",
      ],
      domains: [
        "Html",
        "Css",
        "Python",
        "Django",
        "Cloudinary",
        "PostgreSQL",
        "Render",
        "Machine Learning",
      ],
    },
    {
      name: "HelmiPredico-V1",
      date: "April 2023",
      link: "https://github.com/HelmiDev03/FireBaseAuth",
      description: [
        "Mobile application designed to simplify and automate interactions between doctors and patients for more efficient healthcare management.",
      ],
      domains: [
        "Flutter",
        "FireBase",

      ],
    },
    {
      name: "HMKSOCIALHUB",
      date: "March 2023",
      link: "https://github.com/HelmiDev03/Social-Media-Web-App",
      description: [
        "HMKSOCIALHUB is a social networking website designed to connect individuals and foster a sense of community. The platform requires mandatory registration, ensuring a secure and personalized experience for each user",
      ],
      domains: [
        "Html",
        "Css",
        "Python",
        "Django",
        "Cloudinary",
        "PostgreSQL",
        "Render",
      ],
    },


  ];

  const tag_colors = {
    javascript: "yellow-300",
    firebase: "red-600",
    firestore: "red-500",
    "firebase auth": "red-400",
    "chrome-extension": "yellow-400",
    flutter: "blue-400",
    dart: "blue-500",
    "react-native": "purple-500",
    html5: "pink-600",
    sass: "pink-400",
    tensorflow: "yellow-600",
    django: "green-600",
    python: "green-200",
    "codeforces-api": "gray-300",
    tailwindcss: "blue-300",
    "next.js": "purple-600",
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
        const projectNameFromLink = project.link.split("/");
        const projectName = projectNameFromLink[projectNameFromLink.length - 1];
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
                  <iframe
                    src={`https://ghbtns.com/github-btn.html?user=HelmiDev03&repo=${projectName}&type=star&count=true`}
                    frameBorder="0"
                    scrolling="0"
                    width="150"
                    height="20"
                    title={project.name.toLowerCase() + "-star"}
                  ></iframe>
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
                    const borderColorClass = `border-${tag_colors[domain]}`;
                    const textColorClass = `text-${tag_colors[domain]}`;

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
      title="helmi lakhder resume"
      frameBorder="0"
    ></iframe>
  );
}
