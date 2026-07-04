export const FROM_HOME_QUERY = "from";
export const FROM_HOME_VALUE = "home";

export function withFromHome(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${FROM_HOME_QUERY}=${FROM_HOME_VALUE}`;
}

export function isFromHomeSection(from?: string | string[]) {
  if (from === FROM_HOME_VALUE) {
    return true;
  }

  return Array.isArray(from) && from.includes(FROM_HOME_VALUE);
}

export function detailPageHref(path: string, fromHome: boolean) {
  return fromHome ? withFromHome(path) : path;
}
