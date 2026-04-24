import { useEffect, useMemo, useRef, useState } from "react";
import TerminalInput from "./TerminalInput";

type EntryKind = "command" | "response";

type TerminalEntry = {
  id: number;
  kind: EntryKind;
  tone?: "default" | "muted";
  text: string;
  visibleText: string;
};

const welcomeMessage =
  "Welcome to Joaquin Castrillon's interactive resume.\nThis terminal is designed for quick browsing, even if you have never used one before.\nType start and press Enter for a guided overview, or type help to see all options.";

const commandMap = {
  help:
    "How to use this resume:\nstart      - guided overview for recruiters and hiring managers\nabout      - quick professional summary\neducation  - degree and academic background\nexperience - work experience timeline\nprojects   - featured project highlights\nskills     - technical strengths and tools\ncontact    - email and LinkedIn\nhelp       - show these instructions again\nclear      - reset the screen\n\nNo technical knowledge is needed. Just type one of the words above and press Enter.",
  about:
    "Candidate snapshot:\nJoaquin Castrillon is a software engineer based in Orlando, Florida and a Computer Science graduate from the University of Central Florida.\nHe currently works at Leidos QTC Health Services, building AI-enabled AWS workflows, serverless services, and deployment pipelines.\nHis background combines software engineering, cloud infrastructure, automation, document intelligence, Unity development, and user-focused product thinking.",
  contact:
    "Contact information:\nEmail: joaqcn@gmail.com\nLinkedIn: https://www.linkedin.com/in/jcastrillonn/",
  education:
    "Education:\nUniversity of Central Florida\nBachelor of Science in Computer Science\nGraduated December 2024\nGPA: 3.70 / 4.0\n\nThis academic foundation supported Joaquin's transition into software engineering, AI-enabled systems, and cloud-based development.",
  experience:
    "Work experience:\n1. Software Engineer Associate, Leidos QTC Health Services, January 2025 to Present.\nBuilt CI/CD pipelines, provisioned AWS resources for AI-enabled serverless workflows, developed Python Lambda integrations with OpenAI, and maintained scalable API and cloud architecture.\n2. IT Intern II, Leidos QTC Health Services, June 2024 to December 2024.\nAnalyzed more than 10,000 documents, tested AWS-based indexing systems, and improved infrastructure supporting document retrieval and performance.\n3. Undergraduate Research Assistant, University of Central Florida, March 2024 to May 2024.\nBuilt robotic dog movement and VR training experiences with C#, Unity, and Meta Quest 3.\n4. Software Engineer Intern, University of Central Florida, August 2023 to April 2024.\nImproved internal software with a stronger Visual Basic interface, better documentation, and more maintainable code.\n5. Engineering Intern, Siemens Energy, July 2022 to August 2023.\nAutomated reporting with VBA and supported business analysis using Python, Excel, and Tableau.",
  projects:
    "Featured projects:\n1. Art by AI: Built a React-based application that lets users upload images and generate captions using OpenAI-powered workflows.\n2. Art by AI stack: React.js, JavaScript, Tailwind, Express.js, MongoDB, Git, and OpenAI API integration.\n3. Art by AI impact: Combined front-end usability with back-end AI services to create a complete product experience.\n4. Robot X: Resurgence: Contributed to a Unity and C# rogue-lite game with a focus on procedural level generation.\n5. Robot X focus: Implemented systems that dynamically connect rooms and create more varied, replayable gameplay.\n\nThese projects show a mix of AI product building, full-stack development, and interactive 3D/game engineering.",
  skills:
    "Technical strengths:\n1. Languages: Java, Python, JavaScript, C, C#, MATLAB, Visual Basic, and VBA.\n2. Cloud and platform work: AWS including EC2, S3, IAM, VPC, RDS, Lambda, plus Terraform, CI/CD, and serverless architecture.\n3. Developer tools: Git, Firebase, MongoDB, Unity, VS Code, Visual Studio, PyCharm, IntelliJ, AWS, and Jira.\n4. Libraries and data tools: pandas, NumPy, Matplotlib, scikit-learn, OpenSearch, and PyTorch.\n5. Strongest themes: AI integration, cloud automation, backend workflows, software engineering, and interactive product development.",
  start:
    "Guided resume tour:\n1. Start with about for a concise professional summary.\n2. Type experience to review Joaquin's work across Leidos QTC, UCF, and Siemens Energy.\n3. Type education to see academic background and graduation details from UCF.\n4. Type skills to review programming languages, AWS experience, tools, and technical strengths.\n5. Type projects to explore AI and Unity-based projects including Art by AI and Robot X: Resurgence.\n\nThis interface is meant to make resume review faster. You can jump to any section directly at any time.",
} as const;

function createResponse(command: string) {
  const normalized = command.trim().toLowerCase();

  if (normalized === "startt") {
    return commandMap.start;
  }

  if (normalized in commandMap) {
    return commandMap[normalized as keyof typeof commandMap];
  }

  return `Command not found: ${normalized || "empty input"}\nType help to see supported commands.`;
}

export default function Terminal() {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 1,
      kind: "response",
      text: welcomeMessage,
      visibleText: "",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const historyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextId = useRef(2);

  const activeEntry = useMemo(
    () => entries.find((entry) => entry.kind === "response" && entry.visibleText !== entry.text),
    [entries],
  );

  useEffect(() => {
    if (!activeEntry) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === activeEntry.id
            ? {
                ...entry,
                visibleText: entry.text.slice(0, entry.visibleText.length + 1),
              }
            : entry,
        ),
      );
    }, 8);

    return () => window.clearTimeout(timeout);
  }, [activeEntry]);

  useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [entries]);

  const submitCommand = () => {
    const rawCommand = inputValue.trim();

    if (!rawCommand) {
      return;
    }

    if (rawCommand.toLowerCase() === "clear") {
      setEntries([]);
      setInputValue("");
      return;
    }

    const commandEntry: TerminalEntry = {
      id: nextId.current++,
      kind: "command",
      text: rawCommand,
      visibleText: rawCommand,
    };

    const responseEntry: TerminalEntry = {
      id: nextId.current++,
      kind: "response",
      text: createResponse(rawCommand),
      visibleText: "",
      tone:
        rawCommand.toLowerCase() in commandMap || rawCommand.toLowerCase() === "startt"
          ? "default"
          : "muted",
    };

    setEntries((currentEntries) => [...currentEntries, commandEntry, responseEntry]);
    setInputValue("");
  };

  return (
    <section className="terminal-frame" aria-label="Interactive terminal">
      <header className="terminal-topbar">
        <div className="terminal-controls" aria-hidden="true">
          <span className="terminal-control" data-tone="warm" />
          <span className="terminal-control" data-tone="cool" />
          <span className="terminal-control" data-tone="neutral" />
        </div>
        <div className="terminal-meta">
          <p className="terminal-title">Orbit Terminal</p>
        </div>
        <div className="terminal-status">Interactive</div>
      </header>

      <div className="terminal-body">
        <div className="terminal-history" ref={historyRef}>
          {entries.map((entry) => {
            const isCommand = entry.kind === "command";
            const lines = entry.visibleText.split("\n");

            return (
              <article className="terminal-entry" key={entry.id}>
                <div className="terminal-row">
                  <span className="terminal-label">{isCommand ? "user" : "system"}</span>
                  <p
                    className={`terminal-copy ${
                      isCommand
                        ? "terminal-command"
                        : entry.tone === "muted"
                          ? "terminal-response is-muted"
                          : "terminal-response"
                    }`}
                  >
                    <span className="terminal-prompt" aria-hidden="true">
                      {isCommand ? "$" : ">"}
                    </span>{" "}
                    {lines.map((line, index) => (
                      <span className="terminal-copy-line" key={`${entry.id}-${index}`}>
                        {index === 0 ? line : line}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <TerminalInput
          disabled={false}
          inputRef={inputRef}
          onChange={setInputValue}
          onSubmit={submitCommand}
          value={inputValue}
        />
      </div>
    </section>
  );
}
