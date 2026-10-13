import "@intinyagroup/tokens";

type PreviewStory = () => string;
type PreviewContext = { globals: { theme?: string } };
type PreviewDecoratorResult = { template: string };

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: "neutral",
      list: [
        { name: "neutral", class: "", color: "#ffffff" },
        { name: "warm", class: "", color: "#f6f1e8" },
        { name: "dark", class: "dark", color: "#1a1a1a" },
      ],
    },
  },
  decorators: [
    (story: PreviewStory, context: PreviewContext): PreviewDecoratorResult => {
      const theme = context.globals.theme || "neutral";
      return {
        template: `<div data-ui-theme="${theme}">${story()}</div>`,
      };
    },
  ],
};

export default preview;
