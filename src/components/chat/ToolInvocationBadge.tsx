"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

const basename = (path: string) => path.split("/").filter(Boolean).pop() ?? path;

export function getToolMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const command = (args as { command?: string })?.command;
  const path = (args as { path?: string })?.path;

  if (toolName === "str_replace_editor" && path) {
    switch (command) {
      case "create":
        return `Creating file \`${basename(path)}\``;
      case "str_replace":
      case "insert":
        return `Editing file \`${basename(path)}\``;
      case "view":
        return `Viewing file \`${basename(path)}\``;
      case "undo_edit":
        return `Undoing edit on \`${basename(path)}\``;
    }
  }

  if (toolName === "file_manager" && path) {
    if (command === "rename") {
      const newPath = (args as { new_path?: string })?.new_path;
      if (newPath) {
        return `Renaming \`${basename(path)}\` to \`${basename(newPath)}\``;
      }
    }
    if (command === "delete") {
      return `Deleting \`${basename(path)}\``;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isDone = toolInvocation.state === "result" && !!toolInvocation.result;
  const message = getToolMessage(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
