import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const server = new McpServer({
  name: "sentinel-github-issues",
  version: "1.0.0",
});

server.registerTool(
  "fetchgithubissues",
  {
    title: "Récupérer les issues GitHub",
    description: "Récupère les issues d'un dépôt avec l'API GitHub.",
    inputSchema: z.object({
      owner: z.string().min(1).describe("Propriétaire du dépôt GitHub"),
      repo: z.string().min(1).describe("Nom du dépôt GitHub"),
    }),
  },
  async ({ owner, repo }) => {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`;
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "sentinel-mcp-server",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Le token reste facultatif pour les dépôts publics et n'est jamais stocké dans le code.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
      const response = await fetch(url, { method: "GET", headers });

      if (!response.ok) {
        let details = "";

        try {
          const error = await response.json();
          details = typeof error.message === "string" ? ` : ${error.message}` : "";
        } catch {
          // La réponse d'erreur ne contient pas toujours du JSON.
        }

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `L'API GitHub a répondu avec le statut ${response.status}${details}`,
            },
          ],
        };
      }

      const githubIssues = await response.json();
      const issues = githubIssues.map((issue) => {
        const result = {
          number: issue.number,
          title: issue.title,
          state: issue.state,
          author: issue.user?.login ?? null,
          url: issue.html_url,
          labels: issue.labels.map((label) =>
            typeof label === "string" ? label : label.name,
          ),
          created_at: issue.created_at,
        };

        if (issue.body !== null && issue.body !== undefined) {
          result.body = issue.body;
        }

        return result;
      });

      return {
        content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
        structuredContent: { issues },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Impossible de contacter l'API GitHub : ${message}`,
          },
        ],
      };
    }
  },
);

const transport = new StdioServerTransport();

try {
  await server.connect(transport);
} catch (error) {
  // stderr peut être utilisé sans perturber les messages MCP écrits sur stdout.
  console.error("Impossible de démarrer le serveur MCP :", error);
  process.exitCode = 1;
}
