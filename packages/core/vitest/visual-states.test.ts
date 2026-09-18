import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Alert } from "../components/alert";
import { Badge } from "../components/badge";
import { Avatar, AvatarFallback } from "../components/avatar";

function snippet(text: string) {
  return { render: () => text } as any;
}

describe("Visual regression states — @intinyagroup/ui", () => {
  describe("Button states", () => {
    it("renders disabled state with correct attributes", () => {
      render(Button, { disabled: true, children: snippet("Click me") });
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn).toHaveClass("disabled:opacity-50");
    });

    it("renders loading-like content in primary variant", () => {
      render(Button, { variant: "default", children: snippet("Save") });
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("bg-primary");
    });

    it("renders destructive state", () => {
      render(Button, { variant: "destructive", children: snippet("Delete") });
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("bg-destructive/20");
    });

    it("renders ghost variant hover-ready", () => {
      render(Button, { variant: "ghost", children: snippet("Cancel") });
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("hover:bg-muted/50");
    });
  });

  describe("Input states", () => {
    it("renders disabled input", () => {
      render(Input, { disabled: true, placeholder: "Email" });
      const input = screen.getByPlaceholderText("Email");
      expect(input).toBeDisabled();
    });

    it("renders required input", () => {
      render(Input, { required: true, placeholder: "Name" });
      const input = screen.getByPlaceholderText("Name");
      expect(input).toHaveAttribute("required");
    });
  });

  describe("Alert states", () => {
    it("renders destructive alert", () => {
      render(Alert, { variant: "destructive", children: snippet("Error!") });
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-destructive/10");
    });

    it("renders default info alert", () => {
      render(Alert, { children: snippet("Info") });
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });

  describe("Badge states", () => {
    it("renders primary badge", () => {
      render(Badge, { children: snippet("Active") });
      const badge = screen.getByText("Active");
      expect(badge).toHaveClass("bg-primary");
    });

    it("renders secondary badge", () => {
      render(Badge, { variant: "secondary", children: snippet("Draft") });
      const badge = screen.getByText("Draft");
      expect(badge).toHaveClass("bg-secondary");
    });

    it("renders outline badge", () => {
      render(Badge, { variant: "outline", children: snippet("Beta") });
      const badge = screen.getByText("Beta");
      expect(badge).toHaveClass("border-border");
    });
  });

  describe("Avatar states", () => {
    it("renders avatar with fallback text", () => {
      render(Avatar, {
        children: {
          render: () => `<span>AB</span>`,
        } as any,
      });
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("renders avatar with image src", () => {
      render(Avatar, {
        src: "https://example.com/avatar.jpg",
        alt: "User avatar",
      });
      expect(screen.getByAltText("User avatar")).toBeInTheDocument();
    });
  });
});
