import React from "react";
import { OS_STORAGE_KEY, getOSName } from "../../lib/os";

function DefaultMenu(props) {
  return (
    <div
      id="default-menu"
      className={
        (props.active ? " block " : " hidden ") +
        " cursor-default w-52 context-menu-bg border text-left border-gray-900 rounded text-white py-4 absolute z-50 text-sm"
      }
    >
      <a
        rel="noreferrer noopener"
        href="https://github.com/HelmiDev03"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">❗</span>{" "}
        <span className="ml-2">Report bugs</span>
      </a>
      <Devider />
      <a
        rel="noreferrer noopener"
        href="https://www.linkedin.com/in/helmipl/?originalSubdomain=tn"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🙋‍♂️</span>{" "}
        <span className="ml-2">
          Follow on <strong>Linkedin</strong>
        </span>
      </a>
      <a
        rel="noreferrer noopener"
        href="https://github.com/HelmiDev03"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🤝</span>{" "}
        <span className="ml-2">
          Follow on <strong>Github</strong>
        </span>
      </a>
      <a
        rel="noreferrer noopener"
        href="mailto:lakhder.mohammedhelmi@istic.ucar.tn"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">📥</span>{" "}
        <span className="ml-2">Contact Me</span>
      </a>
      <a
        rel="noreferrer noopener"
        href="https://wa.me/21690217664"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">📱</span>{" "}
        <span className="ml-2">
          Chat on <strong>WhatsApp</strong>
        </span>
      </a>
      <Devider />
      <div
        onClick={() => {
          localStorage.clear();
          // a reset starts the current OS afresh, it does not switch OS
          localStorage.setItem(OS_STORAGE_KEY, props.os);
          window.location.reload();
        }}
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🧹</span>{" "}
        <span className="ml-2">Reset {getOSName(props.os)}</span>
      </div>
    </div>
  );
}

function Devider() {
  return (
    <div className="flex justify-center w-full">
      <div className=" border-t border-gray-900 py-1 w-2/5"></div>
    </div>
  );
}

export default DefaultMenu;
