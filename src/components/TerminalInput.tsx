import type { RefObject } from "react";

type TerminalInputProps = {
  disabled: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
};

export default function TerminalInput({
  disabled,
  inputRef,
  onChange,
  onSubmit,
  value,
}: TerminalInputProps) {
  return (
    <div className="terminal-input-shell">
      <div className="terminal-input-row">
        <span className="terminal-prompt" aria-hidden="true">
          &gt;
        </span>
        <input
          aria-label="Terminal command input"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="terminal-input"
          disabled={disabled}
          ref={inputRef}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type a command and press Enter"
          spellCheck={false}
          value={value}
        />
        <span className="terminal-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
