/**
 * Page backdrop: flat night navy. Kept as a component so a future
 * ambient effect has one place to live.
 */
export function Ambient() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ivory" />;
}
