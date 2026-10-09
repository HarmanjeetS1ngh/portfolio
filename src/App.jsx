import { lazy, Suspense } from 'react';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import About from './components/About.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Dock from './components/Dock.jsx';
import useHashRoute from './useHashRoute.js';
import CustomCursor from './components/CustomCursor.jsx';

const Lab = lazy(() => import('./components/Lab.jsx'));
const CaseStudyPage = lazy(() => import('./case-study/CaseStudyPage.jsx'));
const CrunchyrollCase = lazy(() => import('./case-study/crunchyroll/CrunchyrollCase.jsx'));
const SecurelancerCase = lazy(() => import('./case-study/securelancer/SecurelancerCase.jsx'));
const EpicGainsCase = lazy(() => import('./case-study/epic-gains/EpicGainsCase.jsx'));

const PAGES = {
  '/': () => (
    <>
      <div className="relative z-10 rounded-b-[20px] pb-14" style={{ background: 'linear-gradient(180deg, var(--color-main) calc(100% - 56px), var(--color-surface-1) 100%)' }}>
        <Hero />
        <div className="hero-wash rounded-b-[20px]">
          <Work className="pt-16 md:pt-12 !pb-24 md:!pb-32" />
          <About />
        </div>
      </div>
      <Footer />
    </>
  ),
  '/lab': () => <Lab />,
  '/work/crunchyroll': () => (
    <CaseStudyPage>
      <CrunchyrollCase />
    </CaseStudyPage>
  ),
  '/work/securelancer': () => (
    <CaseStudyPage>
      <SecurelancerCase />
    </CaseStudyPage>
  ),
  '/work/epic-gains': () => (
    <CaseStudyPage>
      <EpicGainsCase />
    </CaseStudyPage>
  ),
};

export default function App() {
  const route = useHashRoute();
  const Page = PAGES[route] ?? PAGES['/'];

  return (
    <>
      <CustomCursor />
      <Header route={route} />
      {/* Keyed by route: a new page mounts fresh and replays the Jotter
          entrance (no exit animation, same as the reference site). */}
      <main key={route}>
        <Suspense fallback={null}>
          <Page />
        </Suspense>
      </main>
      <Dock route={route} />
    </>
  );
}