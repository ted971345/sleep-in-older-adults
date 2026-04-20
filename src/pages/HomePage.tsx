import { SleepWindowIllustration } from "../components/illustrations/SleepWindowIllustration";
import { TeachingVisualCards } from "../components/visuals/TeachingVisualCards";

export const HomePage = () => (
  <div className="content-stack">
    <section className="page-grid">
      <div className="page-intro">
        <p className="eyebrow">Educational reasoning lab</p>
        <h1>Practice sleep case reasoning for older adults.</h1>
        <p className="lead">
          Work through structured cases, connect clinical clues, weigh risk, and
          reflect on decisions with references close at hand.
        </p>
        <div className="action-row">
          <a className="button" href="#/cases">
            Browse cases
          </a>
          <a className="button button--secondary" href="#/reflection">
            Open reflection
          </a>
        </div>
      </div>
      <SleepWindowIllustration />
    </section>
    <TeachingVisualCards />
  </div>
);
