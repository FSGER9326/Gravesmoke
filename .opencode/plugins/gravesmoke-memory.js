export const GravesmokeMemory = async ({ project, client, $, directory, worktree }) => {
  const fs = await import("fs");
  const path = await import("path");
  const memoryPath = path.join(directory, "PROJECT_MEMORY.md");

  function readMemory() {
    try {
      if (fs.existsSync(memoryPath)) {
        return fs.readFileSync(memoryPath, "utf8");
      }
    } catch (e) {}
    return "";
  }

  function appendMemory(entry) {
    const timestamp = new Date().toISOString().split("T")[0];
    const content = `\n## ${timestamp}\n${entry}\n`;
    try {
      fs.appendFileSync(memoryPath, content, "utf8");
    } catch (e) {
      console.error("Memory write failed:", e.message);
    }
  }

  return {
    async event({ event }) {
      if (event.type === "session.idle") {
        const mem = readMemory();
        if (mem) {
          await client.app.log({
            body: {
              service: "gravesmoke-memory",
              level: "info",
              message: "Session complete — memory available",
              extra: { memorySize: mem.length },
            },
          });
        }
      }
      if (event.type === "message.updated") {
        const text = event.message?.content || "";
        if (/remember|save this|don't forget|note this/i.test(text)) {
          const fact = text.replace(/^(remember|save this|don't forget|note this)[,:]?\s*/i, "");
          appendMemory(fact);
          await client.app.log({
            body: {
              service: "gravesmoke-memory",
              level: "info",
              message: "Memory saved",
              extra: { fact: fact.slice(0, 128) },
            },
          });
        }
      }
    },
  };
};
