import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";

// Import every testable core component
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Card, CardHeader, CardContent, CardFooter } from "../components/card";
import { Alert, AlertTitle, AlertDescription } from "../components/alert";
import { Input } from "../components/input";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Flex } from "../components/flex";
import { Grid } from "../components/grid";
import { Stack } from "../components/stack";
import { SidebarNav } from "../components/sidebar";

function snippet() {
  return { render: () => "child" } as any;
}

function textSnippet(text: string) {
  return { render: () => text } as any;
}

describe("Accessibility regression matrix — @intinyagroup/ui", () => {
  describe("Interactive elements must have accessible names", () => {
    it("Button: has accessible role", () => {
      render(Button, { children: textSnippet("Submit") });
      const btn = screen.getByRole("button", { name: "Submit" });
      expect(btn).toBeInTheDocument();
    });

    it("Badge: renders as non-interactive text", () => {
      render(Badge, { children: textSnippet("Draft") });
      const badge = screen.getByText("Draft");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Cards have correct semantic structure", () => {
    it("Card renders as article element", () => {
      render(Card, { children: snippet() });
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("CardHeader renders as header element", () => {
      render(Card, {
        children: {
          render: () => `<div><header>Header</header></div>`,
        } as any,
      });
      expect(screen.getByRole("header")).toBeInTheDocument();
    });

    it("CardFooter renders as footer element", () => {
      render(Card, {
        children: {
          render: () => `<div><footer>Footer</footer></div>`,
        } as any,
      });
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("Alert has correct ARIA semantics", () => {
    it("renders with role alert", () => {
      render(Alert, { children: textSnippet("Warning!") });
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("AlertTitle is present", () => {
      render(Alert, {
        children: {
          render: () => `
            <div role="alert"><h2>Title</h2><p>Content</p></div>
          `,
        } as any,
      });
      expect(screen.getByText("Title")).toBeInTheDocument();
    });
  });

  describe("Form inputs have associated labels", () => {
    it("Input has accessible name via placeholder or label", () => {
      render(Input, { placeholder: "Enter email" });
      const input = screen.getByPlaceholderText("Enter email");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-label", "Enter email");
    });
  });

  describe("SidebarNav structure is accessible", () => {
    it("renders with complementary role and accessible label", () => {
      render(SidebarNav, {
        items: [{ id: "1", label: "Dashboard", icon: "Home" }],
        title: "Main Navigation",
      });
      expect(screen.getByRole("complementary")).toBeInTheDocument();
      expect(screen.getByLabelText("Main Navigation")).toBeInTheDocument();
    });
  });

  describe("Layout primitives have correct ARIA", () => {
    it("Flex does not add any semantic role", () => {
      const { container } = render(Flex, { children: snippet() });
      expect(container.firstChild).not.toHaveAttribute("role");
    });

    it("Grid does not add any semantic role", () => {
      const { container } = render(Grid, { children: snippet() });
      expect(container.firstChild).not.toHaveAttribute("role");
    });

    it("Stack does not add any semantic role", () => {
      const { container } = render(Stack, { children: snippet() });
      expect(container.firstChild).not.toHaveAttribute("role");
    });
  });
});
