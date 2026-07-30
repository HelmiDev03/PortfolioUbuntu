export default async function handler(req, res) {
  try {
    const ghRes = await fetch(
      "https://api.github.com/repos/HelmiDev03/LeetCode/git/trees/main?recursive=1",
      {
        headers: {
          "User-Agent": "Portfolio-App",
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!ghRes.ok) {
      return res.status(200).json({ synced: false, message: "Using cached dataset" });
    }

    const treeData = await ghRes.json();
    const tree = treeData.tree || [];

    // Group items by folder name
    const folderMap = {};
    for (const item of tree) {
      const parts = item.path.split("/");
      if (parts.length === 2 && item.type === "blob") {
        const folder = parts[0];
        const filename = parts[1];
        if (!folderMap[folder]) {
          folderMap[folder] = { folder, raw_urls: [] };
        }
        folderMap[folder].raw_urls.push({
          file: filename,
          url: `https://raw.githubusercontent.com/HelmiDev03/LeetCode/main/${item.path}`,
        });
      }
    }

    const allFolders = Object.keys(folderMap);
    const totalInRepo = allFolders.length;

    // Check if client sent known folders to find newly added problems
    const knownFolders = req.query.known ? req.query.known.split(",") : [];
    const newFolders = allFolders.filter((f) => !knownFolders.includes(f));

    const newProblems = [];
    if (newFolders.length > 0) {
      // Fetch data for up to 10 new problems on demand
      for (const folderName of newFolders.slice(0, 10)) {
        const info = folderMap[folderName];
        const match = folderName.match(/^(\d+)-(.*)$/);
        if (!match) continue;

        const prob_id = parseInt(match[1], 10);
        const raw_slug = match[2];
        const title = raw_slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        let code_text = "";
        let code_filename = "";
        let readme_text = "";
        let difficulty = "Medium";
        let category = "Algorithms";
        let lang = "python";

        for (const item of info.raw_urls) {
          try {
            const fRes = await fetch(item.url);
            if (fRes.ok) {
              const text = await fRes.text();
              if (item.file.toLowerCase() === "readme.md") {
                readme_text = text;
                if (text.includes("Easy")) difficulty = "Easy";
                else if (text.includes("Hard")) difficulty = "Hard";

                if (text.includes("SQL") || text.includes("Database")) category = "SQL & Database";
                else if (text.includes("Tree")) category = "Trees & Graphs";
                else if (text.includes("DP")) category = "Dynamic Programming";
              } else {
                code_text = text;
                code_filename = item.file;
                if (item.file.endsWith(".cpp")) lang = "cpp";
                else if (item.file.endsWith(".sql")) { lang = "sql"; category = "SQL & Database"; }
                else if (item.file.endsWith(".js")) lang = "javascript";
              }
            }
          } catch (e) {}
        }

        newProblems.push({
          id: prob_id,
          title,
          folder: folderName,
          difficulty,
          category,
          githubUrl: `https://github.com/HelmiDev03/LeetCode/tree/main/${folderName}`,
          description: readme_text,
          readme: readme_text,
          code: code_text,
          codeFilename: code_filename || `${folderName}.py`,
          language: lang,
        });
      }
    }

    return res.status(200).json({
      synced: true,
      totalRepoCount: totalInRepo,
      newProblems,
    });
  } catch (error) {
    return res.status(200).json({ synced: false, error: error.message });
  }
}
