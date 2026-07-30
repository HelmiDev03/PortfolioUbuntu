import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { SiLeetcode } from "react-icons/si";
import { ALL_LEETCODE_PROBLEMS } from "./leetcode_data";

// Dynamically import CodeMirror to prevent SSR issues in Next.js
const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror"),
  { ssr: false }
);

export const LeetCodeApp = () => {
  const [problemList, setProblemList] = useState(ALL_LEETCODE_PROBLEMS || []);
  const [selectedProblem, setSelectedProblem] = useState(problemList[0] || {});
  const [activeTab, setActiveTab] = useState("code"); // "code", "description"
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [editorExtensions, setEditorExtensions] = useState([]);
  const [isSynced, setIsSynced] = useState(false);
  const [totalCount, setTotalCount] = useState(700);

  // Auto-sync with live GitHub repository on mount
  useEffect(() => {
    const knownFolders = (ALL_LEETCODE_PROBLEMS || []).map((p) => p.folder).join(",");
    fetch(`/api/leetcode?known=${encodeURIComponent(knownFolders)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.synced) {
          setIsSynced(true);
          if (data.totalRepoCount) {
            setTotalCount(Math.max(700, data.totalRepoCount));
          }
          if (data.newProblems && data.newProblems.length > 0) {
            setProblemList((prev) => {
              const prevIds = new Set(prev.map((p) => p.id));
              const fresh = data.newProblems.filter((p) => !prevIds.has(p.id));
              return [...fresh, ...prev].sort((a, b) => a.id - b.id);
            });
          }
        }
      })
      .catch((err) => console.log("GitHub sync check:", err));
  }, []);

  // Dynamically load CodeMirror AST Syntax Highlighting extensions (OneDark & Python)
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("@codemirror/theme-one-dark"),
        import("@codemirror/lang-python"),
      ])
        .then(([themeMod, pythonMod]) => {
          setEditorExtensions([themeMod.oneDark, pythonMod.python()]);
        })
        .catch((err) => {
          console.error("CodeMirror extension load error:", err);
        });
    }
  }, []);

  // Filter problems
  const filteredProblems = problemList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);
    const matchesDiff =
      difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Hard":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getCodeString = (code) => {
    if (typeof code === "string") return code;
    if (typeof code === "object" && code !== null) {
      if (code.python) return code.python;
      if (code.cpp) return code.cpp;
      if (code.sql) return code.sql;
      if (code.javascript) return code.javascript;
      const vals = Object.values(code);
      if (vals.length > 0 && typeof vals[0] === "string") return vals[0];
    }
    return "// Solution code file available on GitHub repository";
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-gray-100 font-sans select-none overflow-hidden">
      {/* Top Header / Branding Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333] shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-[#FFA116]/10 rounded-lg border border-[#FFA116]/30">
            <SiLeetcode className="text-[#FFA116] text-xl" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base tracking-wide">
                LeetCode Solutions Studio
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA116]/20 text-[#FFA116] font-semibold border border-[#FFA116]/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Live Synced to GitHub"></span>
                <span>+{totalCount} Solutions</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Helmi Lakhder
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <a
            href="https://leetcode.com/HelmiDev/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#FFA116] hover:bg-[#e08e10] text-black transition-colors"
          >
            <SiLeetcode className="text-sm" />
            <span>LeetCode Profile</span>
          </a>
          <a
            href="https://github.com/HelmiDev03/LeetCode"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#2d2d2d] hover:bg-[#383838] text-gray-200 border border-[#404040] transition-colors"
          >
            <FontAwesomeIcon icon={faGithub} className="text-sm" />
            <span>View GitHub Repo</span>
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Problem Explorer */}
        <div className="w-full md:w-80 flex flex-col bg-[#252526] border-r border-[#333333]">
          {/* Search & Filters */}
          <div className="p-3 border-b border-[#333333] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <span>EXPLORER ({filteredProblems.length})</span>
                {isSynced && (
                  <span className="text-[10px] text-emerald-400 font-normal lowercase">(live synced)</span>
                )}
              </span>
            </div>
            <input
              type="text"
              placeholder="Filter by problem name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded bg-[#3c3c3c] text-white border border-[#555555] focus:outline-none focus:border-[#0e639c] placeholder-gray-400"
            />
            <div className="flex items-center justify-between text-xs gap-1">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
                    difficultyFilter === diff
                      ? "bg-[#0e639c] text-white shadow"
                      : "bg-[#333333] text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Problem List */}
          <div className="flex-grow overflow-y-auto divide-y divide-[#2d2d2d]">
            {filteredProblems.map((problem) => {
              const isSelected = selectedProblem.id === problem.id;
              return (
                <div
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#37373d] border-l-4 border-[#0e639c] text-white"
                      : "hover:bg-[#2a2d2e] text-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs line-clamp-1">
                      {problem.id}. {problem.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                    <span className="bg-[#1e1e1e] px-2 py-0.5 rounded text-gray-400 border border-[#333333]">
                      {problem.codeFilename || "solution.py"}
                    </span>
                    <span className="text-gray-500 font-mono text-[10px]">
                      #{problem.folder?.split("-")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Panel - VS Code View */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {selectedProblem.id ? (
            <>
              {/* VS Code Tab Header */}
              <div className="flex items-center justify-between bg-[#2d2d2d] border-b border-[#333333] px-2 pt-1">
                {/* Active File Tab & View Selector */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-t border-t-2 transition-all ${
                      activeTab === "code"
                        ? "bg-[#1e1e1e] text-white border-[#0e639c]"
                        : "bg-[#2d2d2d] text-gray-400 hover:bg-[#252526]"
                    }`}
                  >
                    <span className="text-blue-400 font-mono">
                      {selectedProblem.codeFilename || "solution.py"}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("description")}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-t border-t-2 transition-all ${
                      activeTab === "description"
                        ? "bg-[#1e1e1e] text-white border-[#FFA116]"
                        : "bg-[#2d2d2d] text-gray-400 hover:bg-[#252526]"
                    }`}
                  >
                    <span className="text-amber-400 font-semibold">
                      Description (README.md)
                    </span>
                  </button>
                </div>

                {/* GitHub Folder Link */}
                <div className="flex items-center space-x-3 pb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${getDifficultyBadge(
                      selectedProblem.difficulty
                    )}`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  <a
                    href={selectedProblem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center space-x-1 font-mono"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-xs" />
                    <span>{selectedProblem.folder}</span>
                  </a>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* 1. EXACT VS CODE / CODEMIRROR COLORING MATCHING USER SCREENSHOT */}
                {activeTab === "code" && (
                  <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1 overflow-y-auto">
                      {typeof window !== "undefined" && CodeMirror && (
                        <CodeMirror
                          value={getCodeString(selectedProblem.code)}
                          height="100%"
                          theme="dark"
                          extensions={editorExtensions}
                          readOnly={true}
                          editable={false}
                          basicSetup={{
                            lineNumbers: true,
                            foldGutter: true,
                            dropCursor: false,
                            allowMultipleSelections: false,
                            indentOnInput: false,
                          }}
                          className="text-sm font-mono rounded-xl border border-[#333333] overflow-hidden"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* 2. DESCRIPTION TAB (GitHub README.md Formatted Preview) */}
                {activeTab === "description" && (
                  <div className="max-w-4xl text-gray-200 font-sans leading-relaxed">
                    <div className="github-markdown-preview p-6 bg-[#0d1117] rounded-xl border border-[#30363d] shadow-2xl overflow-x-auto text-sm space-y-4">
                      <div
                        className="github-readme-body leading-relaxed space-y-3 font-sans"
                        dangerouslySetInnerHTML={{
                          __html: selectedProblem.readme
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a problem from the left explorer to view the solution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeetCodeApp;

export const displayLeetCode = () => {
  return <LeetCodeApp />;
};
