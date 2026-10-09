/** Shared shell for every case study: ends at the "Next projects" card, with room for the dock. */
export default function CaseStudyPage({ children }) {
  return (
    <div className="case-study relative z-10 min-h-screen bg-main pb-28 md:pb-32">{children}</div>
  );
}
