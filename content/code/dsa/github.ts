import { Issue, parseMarkdown } from "./parser";

const OWNER = process.env.OWNER || "Umex10";
const REP = process.env.REP || "dsa-exercises";
const TK = process.env.TK;

const getHeaders = () => {
    const headers: HeadersInit = {
        "Accept": "application/vnd.github.v3+json",
    };
    if (TK) {
        headers["Authorization"] = `Bearer ${TK}`;
    }
    return headers;
};

export async function fetchAllIssues(): Promise<Issue[]> {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REP}/contents`, {
        headers: getHeaders(),
        next: { revalidate: 60 }
    });
    
    if (!res.ok) {
        return [];
    }

    const contents = await res.json();
    const folders = contents.filter((item: any) => item.type === "dir" || !item.name.includes('.')); // Some git items might not have type dir reliably, type dir is best
    
    const issues = await Promise.all(
        folders.map(async (folder: any) => {
            return await fetchIssueDetails(folder.name);
        })
    );
    
    return issues.filter((p): p is Issue => p !== null);
}

export async function fetchIssueDetails(slug: string): Promise<Issue | null> {
    try {
        const encodedSlug = encodeURIComponent(slug);
        const res = await fetch(`https://api.github.com/repos/${OWNER}/${REP}/contents/${encodedSlug}`, {
            headers: getHeaders(),
            next: { revalidate: 60 }
        });
        
        if (!res.ok) return null;
        let contents = await res.json();
        
        // Handle case where it might be a single file returned instead of array unexpectedly 
        if (!Array.isArray(contents)) {
             contents = [contents];
        }
    
        const mdFile = contents.find((f: any) => f.name.endsWith(".md"));
        const javaFile = contents.find((f: any) => f.name.endsWith(".java"));
        const imgFile = contents.find((f: any) => f.name.endsWith(".png") || f.name.endsWith(".jpg") || f.name.endsWith(".jpeg"));
        
        const fetchFile = async (url: string) => {
            const fileRes = await fetch(url, { headers: getHeaders() });
            return await fileRes.text();
        };

        const rawMd = mdFile ? await fetchFile(mdFile.download_url) : "";
        const rawCode = javaFile ? await fetchFile(javaFile.download_url) : "";
        const imageUrl = imgFile ? `/api/image?slug=${encodeURIComponent(slug)}&file=${encodeURIComponent(imgFile.name)}` : undefined;
        
        const parsed = parseMarkdown(rawMd, slug);
        
        return {
            slug,
            frontmatter: parsed.frontmatter,
            content: parsed.content,
            code: rawCode,
            imageUrl,
        };
    } catch (e) {
        console.error("Error fetching issue:", slug, e);
        return null;
    }
}
