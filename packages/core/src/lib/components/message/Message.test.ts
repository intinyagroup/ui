import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { createRawSnippet } from "svelte";
import Message from "./Message.svelte";

function textSnippet(text: string) {
  return createRawSnippet(() => ({
    render: () => text,
  }));
}

describe("Message", () => {
  it("renders with info tone by default with status live semantics", () => {
    const { container } = render(Message, {
      props: {
        title: "Info title",
        message: "Info message",
      },
    });

    const root = screen.getByRole("status");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-tone", "info");
    expect(root).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Info title")).toBeInTheDocument();
    expect(screen.getByText("Info message")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders error tone with alert role and assertive live semantics", () => {
    render(Message, {
      props: {
        tone: "error",
        title: "Error title",
        description: "Something failed",
      },
    });

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("data-tone", "error");
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("renders success and warning tones", () => {
    const { unmount } = render(Message, {
      props: {
        tone: "success",
        title: "Saved",
      },
    });
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "success");
    unmount();

    render(Message, {
      props: {
        tone: "warning",
        title: "Caution",
      },
    });
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "warning");
  });

  it("renders loading tone as non-dismissible by default with reduced-motion support", () => {
    const { container } = render(Message, {
      props: {
        tone: "loading",
        title: "Syncing data",
      },
    });

    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "loading");
    expect(
      screen.queryByRole("button", { name: /dismiss/i }),
    ).not.toBeInTheDocument();

    const spinner = container.querySelector("svg");
    expect(spinner).not.toBeNull();
    expect(spinner?.getAttribute("class")).toContain(
      "motion-safe:animate-spin",
    );
    expect(spinner?.getAttribute("class")).toContain(
      "motion-reduce:animate-none",
    );
  });

  it("fires dismiss callback and removes message when dismissed", async () => {
    const onDismiss = vi.fn();
    render(Message, {
      props: {
        tone: "info",
        title: "Dismissible message",
        onDismiss,
      },
    });

    const button = screen.getByRole("button", { name: /dismiss/i });
    await fireEvent.click(button);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders action button and triggers callback", async () => {
    const onAction = vi.fn();
    render(Message, {
      props: {
        title: "Upgrade available",
        actionLabel: "Upgrade now",
        onAction,
      },
    });

    const actionButton = screen.getByRole("button", { name: "Upgrade now" });
    await fireEvent.click(actionButton);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders custom children and action snippet", () => {
    render(Message, {
      props: {
        title: "Customized",
        children: textSnippet("Custom child content"),
        action: textSnippet("Action snippet content"),
      },
    });

    expect(screen.getByText("Custom child content")).toBeInTheDocument();
    expect(screen.getByText("Action snippet content")).toBeInTheDocument();
  });

  it("supports action object with onclick handler", async () => {
    const onclick = vi.fn();
    render(Message, {
      props: {
        title: "Action object",
        action: {
          label: "Retry",
          onclick,
        },
      },
    });

    const retryBtn = screen.getByRole("button", { name: "Retry" });
    await fireEvent.click(retryBtn);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("allows loading message to be dismissible when explicit", () => {
    render(Message, {
      props: {
        tone: "loading",
        dismissible: true,
      },
    });

    expect(
      screen.getByRole("button", { name: /dismiss/i }),
    ).toBeInTheDocument();
  });
});
