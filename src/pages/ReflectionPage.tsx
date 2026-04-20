import { ReflectionIllustration } from "../components/illustrations/ReflectionIllustration";

export const ReflectionPage = () => (
  <section className="page-grid">
    <div className="page-intro">
      <p className="eyebrow">Reflection</p>
      <h1>Turn case decisions into durable learning.</h1>
      <p className="lead">
        Capture reasoning moves, uncertainty, evidence links, and follow-up
        questions after each case.
      </p>
      <div className="reflection-prompts">
        <h2>Starter prompts</h2>
        <ul>
          <li>Which sleep clue changed your working hypothesis?</li>
          <li>Where did safety, function, or caregiver context affect priority?</li>
          <li>What would you verify before making a recommendation?</li>
        </ul>
      </div>
    </div>
    <ReflectionIllustration />
  </section>
);
