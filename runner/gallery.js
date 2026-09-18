const yamlFiles = import.meta.glob("../Class/*/sandcastle.yaml", {
  query: "?raw",
  eager: true,
  import: "default",
});

function parseYaml(text) {
  const title =
    text
      .match(/^title:\s*(.+)$/m)?.[1]
      ?.trim()
      ?.replace(/^["']|["']$/g, "") ?? "";
  const description =
    text
      .match(/^description:\s*([\s\S]*?)(?=\n[A-Za-z][\w-]*:|\n*$)/m)?.[1]
      ?.replace(/\s+/g, " ")
      .trim() ?? "";
  const labels = [];
  const labelBlock = text.match(/^labels:\n((?:[ \t]*-[ \t]*.+\n?)*)/m);
  if (labelBlock) {
    for (const match of labelBlock[1].matchAll(/^[ \t]*-[ \t]*(.+)$/gm)) {
      labels.push(match[1].trim());
    }
  }
  return { title, description, labels };
}

export const samples = Object.entries(yamlFiles)
  .map(([path, text]) => {
    const slug = path.split("/").at(-2);
    return {
      slug,
      ...parseYaml(String(text)),
      thumbnail: `/Class/${slug}/thumbnail.jpg`,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

export function findSample(slug) {
  return samples.find((sample) => sample.slug === slug);
}
