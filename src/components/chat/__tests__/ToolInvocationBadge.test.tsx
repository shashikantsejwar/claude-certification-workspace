import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("shows friendly message and success dot when creating a file", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/card.tsx" },
    state: "result",
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating file `card.tsx`")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows spinner while a create call is in progress", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/card.tsx" },
    state: "call",
  } as ToolInvocation;

  const { container } = render(
    <ToolInvocationBadge toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating file `card.tsx`")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows editing message for str_replace command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/components/card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing file `card.tsx`")).toBeDefined();
});

test("shows editing message for insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/components/card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing file `card.tsx`")).toBeDefined();
});

test("shows viewing message for view command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/components/card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing file `card.tsx`")).toBeDefined();
});

test("shows undo message for undo_edit command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/components/card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Undoing edit on `card.tsx`")).toBeDefined();
});

test("shows rename message with both file names", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming `old.tsx` to `new.tsx`")).toBeDefined();
});

test("shows delete message for delete command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "/foo.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting `foo.tsx`")).toBeDefined();
});

test("shows only the file basename for nested paths", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/ui/card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating file `card.tsx`")).toBeDefined();
  expect(
    screen.queryByText("Creating file `/components/ui/card.tsx`")
  ).toBeNull();
});

test("falls back to raw tool name for unrecognized tools", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "some_other_tool",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("falls back to raw tool name when args are incomplete", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: {},
    state: "partial-call",
  } as ToolInvocation;

  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});
