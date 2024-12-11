import React, { Component } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

export class Python extends Component {
  constructor() {
    super();
    this.state = {
      code: "", // Python code input
      terminalInput: "", // Input for the Python program (stdin)
      output: "", // Output to display
      skulptLoaded: false, // Tracks whether Skulpt is loaded
      loadingError: "", // Tracks if there's an error during Skulpt loading
    };
  }

  componentDidMount() {
    this.loadSkulpt(); // Load Skulpt scripts dynamically
  }

  loadSkulpt = () => {
    // Load Skulpt dynamically only if not already loaded
    if (this.state.skulptLoaded) return;

    const script1 = document.createElement("script");
    script1.src = "https://unpkg.com/skulpt/dist/skulpt.min.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://unpkg.com/skulpt/dist/skulpt-stdlib.js";
    script2.async = true;
    script2.onload = () => {
      this.setState({ skulptLoaded: true, loadingError: "" });
    };
    script2.onerror = (err) => {
      this.setState({
        loadingError: `Error loading Skulpt standard library: ${err.message}`,
      });
    };
    document.body.appendChild(script2);
    script1.onload = () => {
      script2.onload = () => {
        this.setState({ skulptLoaded: true, loadingError: "" });
      };
      script2.onerror = (err) => {
        this.setState({
          loadingError: `Error loading Skulpt standard library: ${err.message}`,
        });
      };
      document.body.appendChild(script2);
    };

    script1.onerror = (err) => {
      this.setState({
        loadingError: `Error loading Skulpt core: ${err.message}`,
      });
    };

    document.body.appendChild(script1);
  };

  handleCodeChange = (value) => {
    this.setState({ code: value });
  };

  handleTerminalInputChange = (e) => {
    this.setState({ terminalInput: e.target.value });
  };

  executePythonCode = () => {
    if (this.state.loadingError) {
      this.setState({ output: this.state.loadingError });
      return;
    }

    if (!this.state.skulptLoaded) {
      this.setState({ output: "Skulpt is not yet loaded. Please wait..." });
      return;
    }

    const { code, terminalInput } = this.state;
    const outf = (text) => {
      this.setState((prevState) => ({
        output: prevState.output + text,
      }));
    };

    try {
      this.setState({ output: "" }); // Clear previous output
      Sk.configure({
        output: outf,
        read: (input) => {
          if (input === "input") {
            return terminalInput; // Return terminal input as stdin
          }
          throw new Error("Read function is not implemented.");
        },
      });
      Sk.importMainWithBody("<stdin>", false, code, true);
    } catch (err) {
      this.setState({ output: `Error: ${err.toString()}` });
    }
  };

  render() {
    const { code, terminalInput, output, loadingError } = this.state;

    return (
      <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm">
          <span className="font-bold ml-2">Python Compiler</span>
          <div className="flex">
            <div
              onClick={this.executePythonCode}
              className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer"
            >
              Run
            </div>
          </div>
        </div>

        {/* Code Editor Section */}
        <CodeMirror
          value={code}
          height="40%"
          extensions={[python()]}
          onChange={this.handleCodeChange}
          theme={oneDark}
        />

        {/* Terminal Input Section */}
        <textarea
          value={terminalInput}
          onChange={this.handleTerminalInputChange}
          placeholder="Enter input for the Python program (stdin)..."
          className="flex-grow bg-black text-white p-2 font-mono"
          style={{ height: "20%", resize: "none", border: "none", outline: "none" }}
        />

        {/* Output Section */}
        <div className="flex-grow bg-ub-warm-grey text-white p-4 overflow-auto windowMainScreen">
          <h3 className="font-bold">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
          {loadingError && (
            <div className="text-red-500 mt-2 font-semibold">{loadingError}</div>
          )}
        </div>
      </div>
    );
  }
}

export default Python;

export const displayPython = () => {
  return <Python />;
};
