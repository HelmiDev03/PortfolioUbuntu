import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import axios from "axios";

const Gedit = () => {
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("Gedit Component Mounted");
  }, []);

  const validateForm = () => {
    let formErrors = {};
    if (!name.trim()) formErrors.name = "Name is required.";
    if (!email.trim()) formErrors.email = "Email is required.";
    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)) 
      formErrors.email = "Email is invalid.";
    if (!subject.trim()) formErrors.subject = "Subject is required.";
    if (!message.trim()) formErrors.message = "Message cannot be empty.";
    return formErrors;
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
    const formErrors = validateForm();
    setErrors(formErrors); // Update errors on each input change
  };

  const sendMessage = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are errors, return early
    if (Object.keys(formErrors).length > 0) return;

    setSending(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const serviceID = "service_ov3ejbl";
    const templateID = "template_grgfq0h";
    const templateParams = {
      from_name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    };

    const data = {
      service_id: serviceID,
      template_id: templateID,
      user_id: "WCNuy1UUn60oafefo",
      template_params: templateParams,
    };

    try {
      await axios.post("https://api.emailjs.com/api/v1.0/email/send", data);
      setSending(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);// Reset success message after 5 seconds
      
    } catch (err) {
      setSending(false);
      console.error("Failed to send message", err);
    }

    ReactGA.event({
      category: "Send Message",
      action: `${trimmedName}, ${trimmedEmail}, ${trimmedSubject}, ${trimmedMessage}`,
    });
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-ub-cool-grey text-white select-none">
      <div className="flex items-center justify-between w-full bg-ub-gedit-light bg-opacity-60 border-b border-t border-blue-400 text-sm">
        <span className="font-bold ml-2">Send a Message to Me</span>
        <button
          onClick={sendMessage}
          className={`border border-black bg-black px-3 py-0.5 my-1 mx-1 rounded ${name.trim() && email.trim() && message.trim() && subject.trim() ? 'bg-opacity-80' : 'bg-opacity-50'}`}
        >
          Send
        </button>
      </div>
      <div className="relative flex-grow flex flex-col bg-ub-gedit-dark font-normal windowMainScreen">
        <div className="relative">
          <input
            value={name}
            onChange={(e) =>  handleChange(e, setName)}
            className="w-full text-ubt-gedit-orange focus:bg-ub-gedit-light outline-none font-medium text-sm pl-6 py-0.5 bg-transparent"
            placeholder="Your Name"
            spellCheck="false"
            autoComplete="off"
            type="text"
          />
        </div>
        <div className="relative">
          <input
            value={email}
            onChange={(e) => handleChange(e, setEmail)}
            className="w-full text-ubt-gedit-blue focus:bg-ub-gedit-light outline-none font-medium text-sm pl-6 py-0.5 bg-transparent"
            placeholder="Your Email"
            spellCheck="false"
            autoComplete="off"
            type="email"
          />
        </div>
        <div className="relative">
          <input
            value={subject}
            onChange={(e) => handleChange(e, setSubject)}
            className="w-full my-1 text-ubt-gedit-blue focus:bg-ub-gedit-light outline-none text-sm font-normal pl-6 py-0.5 bg-transparent"
            placeholder="Subject (e.g., feedback for this website)"
            spellCheck="false"
            autoComplete="off"
            type="text"
          />
        </div>
        <div className="relative flex-grow">
          <textarea
            value={message}
            onChange={(e) => { handleChange(e, setMessage) ; validateForm(); }}
            className="w-full font-light text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-6 py-1 bg-transparent"
            placeholder="Message"
            spellCheck="false"
            autoComplete="none"
          />
        </div>
        <div  className="text-red-500 w-full font-light text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-6 py-1 bg-transparent text-xs mt-2 relative flex-grow H">
        {/* Display errors under the form */}
        {errors.name && <p>{errors.name}</p>}
        {errors.email && <p>{errors.email}</p>}
        {errors.subject && <p>{errors.subject}</p>}
        {errors.message && <p>{errors.message}</p>}
      </div>
      </div>

      

      {sending && (
        <div className="flex justify-center items-center animate-pulse h-full w-full bg-gray-400 bg-opacity-30 absolute top-0 left-0">
          <img className="w-8 absolute animate-spin" src="./themes/Yaru/status/process-working-symbolic.svg" alt="Processing" />
        </div>
      )}

      {success && !sending && (
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center p-2">
          <p>Your message was sent successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Gedit;

export const displayGedit = () => {
  return <Gedit />;
};
