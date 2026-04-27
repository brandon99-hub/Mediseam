import { useEffect } from "react";

export function useSEO(title: string, description: string) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;
    
    // Helper to safely update or create meta tags
    const updateMetaTag = (selector: string, nameAttr: string, nameValue: string, content: string) => {
      let tag = document.querySelector(`meta[${selector}="${nameValue}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(nameAttr, nameValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Update Standard Description
    updateMetaTag("name", "name", "description", description);

    // 3. Update Open Graph
    updateMetaTag("property", "property", "og:title", title);
    updateMetaTag("property", "property", "og:description", description);

    // 4. Update Twitter Card
    updateMetaTag("name", "name", "twitter:title", title);
    updateMetaTag("name", "name", "twitter:description", description);

  }, [title, description]);
}

