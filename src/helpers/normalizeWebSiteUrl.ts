export const normalizeWebsiteUrl = (url: string): string => {
  if (!url) return "";

  let formattedUrl = url.trim();

  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    const parsed = new URL(formattedUrl);
    const normalized = `${parsed.protocol}//${parsed.hostname}/`;
    return normalized;
  } catch (error) {
    return formattedUrl.endsWith("/") ? formattedUrl : formattedUrl + "/";
  }
};
