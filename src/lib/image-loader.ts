// Used only for the static preview export: serves images as-is, relative to the page,
// so the site works from any sub-path. Normal builds use Next's optimizer instead.
export default function relativeLoader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `.${src}` : src;
}
