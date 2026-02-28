import React, { useEffect, useRef, useState } from "react";
import { DevSceneSvg } from "./DevSceneSvg";

type Runner = {
  x: number;
  y: number;
};

export const App: React.FC = () => {
  const angularRef = useRef<HTMLDivElement | null>(null);
  const reactRef = useRef<HTMLDivElement | null>(null);
  const snow1Ref = useRef<HTMLDivElement | null>(null);
  const snow2Ref = useRef<HTMLDivElement | null>(null);
  const snow3Ref = useRef<HTMLDivElement | null>(null);
  const nodeHeadRef = useRef<HTMLSpanElement | null>(null);
  const mongoHeadRef = useRef<HTMLSpanElement | null>(null);

  const [hitTarget, setHitTarget] = useState<"angular" | "react" | null>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    if (!animationsEnabled) {
      return;
    }

    const angularEl = angularRef.current;
    const reactEl = reactRef.current;
    const s1 = snow1Ref.current;
    const s2 = snow2Ref.current;
    const s3 = snow3Ref.current;

    if (!angularEl || !reactEl || !s1 || !s2 || !s3 || typeof window === "undefined") {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    const padding = 60;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    let angular: Runner = {
      x: padding,
      y: height * 0.5
    };

    let react: Runner = {
      x: padding + 140,
      y: height * 0.5
    };

    type Snowball = {
      el: HTMLDivElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      ttl: number;
      target: "angular" | "react";
      originX: number;
      originY: number;
    };

    const snowballs: Snowball[] = [
      {
        el: s1,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        age: 0,
        ttl: 0,
        target: "react",
        originX: 110,
        originY: 70
      },
      {
        el: s2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        age: 0,
        ttl: 0,
        target: "react",
        originX: 110,
        originY: 100
      },
      {
        el: s3,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        age: 0,
        ttl: 0,
        target: "angular",
        originX: 110,
        originY: 130
      }
    ];

    // direction of Angular's movement (unit vector)
    let dirX = 1;
    let dirY = 0.12;

    let lastTime = performance.now();
    let frameId: number;

    const render = () => {
      angularEl.dataset.role = "chaser";
      reactEl.dataset.role = "runner";

      angularEl.style.transform = `translate3d(${angular.x}px, ${angular.y}px, 0)`;
      reactEl.style.transform = `translate3d(${react.x}px, ${react.y}px, 0)`;

      snowballs.forEach((s) => {
        s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const resetSnowball = (s: Snowball) => {
      const nodeEl = nodeHeadRef.current;
      const mongoEl = mongoHeadRef.current;

      // We want the snowball to appear from the throwing hand,
      // which is slightly to the right of the head and a bit lower than center.
      const computeOriginFromHead = (el: HTMLSpanElement) => {
        const r = el.getBoundingClientRect();
        const offsetX = r.width + 14; // to the right of the head, near the hand
        const offsetY = r.height * 0.55; // slightly below vertical center
        return {
          x: r.left + offsetX,
          y: r.top + offsetY
        };
      };

      let origin: { x: number; y: number } | null = null;

      if (s === snowballs[0] && nodeEl) {
        origin = computeOriginFromHead(nodeEl);
      } else if (s === snowballs[1] && mongoEl) {
        origin = computeOriginFromHead(mongoEl);
      } else if (s === snowballs[2] && nodeEl) {
        origin = computeOriginFromHead(nodeEl);
      }

      // If for some reason the corresponding thrower is not mounted yet,
      // skip resetting this snowball so it won't appear from an incorrect place.
      if (!origin) {
        return;
      }

      s.originX = origin.x;
      s.originY = origin.y;

      const targetPos = s.target === "react" ? react : angular;
      const dx = targetPos.x - s.originX;
      const dy = targetPos.y - s.originY;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = 0.4; // px per ms

      const nx = dx / dist;
      const ny = dy / dist;

      s.x = s.originX;
      s.y = s.originY;
      s.vx = nx * speed;
      s.vy = ny * speed;
      s.age = 0;
      s.ttl = 1800 + Math.random() * 700;
    };

    snowballs.forEach((s) => resetSnowball(s));

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      const chaseSpeed = 0.25; // px per ms - cat (Angular)
      const gap = 140; // distance between Angular and React

      // Slightly change direction over time so the path feels organic
      const jitter = 0.0006;
      dirX += (Math.random() - 0.5) * jitter * dt;
      dirY += (Math.random() - 0.5) * jitter * dt;

      // Normalize direction
      const len = Math.hypot(dirX, dirY) || 1;
      dirX /= len;
      dirY /= len;

      // Move Angular (chaser) along its direction
      angular.x += dirX * chaseSpeed * dt;
      angular.y += dirY * chaseSpeed * dt;

      const xMin = padding;
      const xMax = width - padding;
      const yMin = padding;
      const yMax = height - padding;

      // Bounce Angular off the edges
      if (angular.x < xMin || angular.x > xMax) {
        dirX *= -1;
        angular.x = clamp(angular.x, xMin, xMax);
      }
      if (angular.y < yMin || angular.y > yMax) {
        dirY *= -1;
        angular.y = clamp(angular.y, yMin, yMax);
      }

      // Place React (runner) ahead of Angular in the same direction, like a mouse
      react.x = angular.x + dirX * gap;
      react.y = angular.y + dirY * gap;

      react.x = clamp(react.x, xMin, xMax);
      react.y = clamp(react.y, yMin, yMax);

      // Update snowballs to fly toward where Angular/React were at launch time
      snowballs.forEach((s) => {
        s.age += dt;
        if (s.age > s.ttl) {
          resetSnowball(s);
          return;
        }

        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Simple hit detection against the intended target
        const targetPos = s.target === "react" ? react : angular;
        const hx = s.x - targetPos.x;
        const hy = s.y - targetPos.y;
        const hitRadius = 40;

        if (hx * hx + hy * hy < hitRadius * hitRadius) {
          setHitTarget(s.target);
          setTimeout(() => {
            setHitTarget((current) => (current === s.target ? null : current));
          }, 700);
          resetSnowball(s);
        }
      });

      render();
      frameId = requestAnimationFrame(loop);
    };

    render();
    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [animationsEnabled]);
  return (
    <div className="page">
      <div className="background-gradient" />
      <button
        type="button"
        className={`anim-toggle ${animationsEnabled ? "anim-toggle-pulse" : ""}`}
        onClick={() => setAnimationsEnabled((prev) => !prev)}
      >
        {animationsEnabled ? "Disable animation" : "Enable animation"}
      </button>
      {animationsEnabled && (
        <div className="dev-scene" aria-hidden="true">
          <div className="dev-scene-inner">
            <DevSceneSvg className="dev-scene-svg" />
            <div className="dev-screen-overlay">
              <div className="dev-code-wrap">
                <pre className="dev-code">
{`const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api').then(r => r.json())
      .then(setData);
  }, []);
  return <List items={data} />;
}
const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api').then(r => r.json())
      .then(setData);
  }, []);
  return <List items={data} />;
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      {animationsEnabled && (
        <div className="global-chase" aria-hidden="true">
        <div className="thrower-band">
          <div className="thrower-list">
            <div className="thrower thrower-node">
              <span className="thrower-label">Node.js</span>
              <div className="runner-body thrower-body">
                <span className="runner-head thrower-head" ref={nodeHeadRef}>
                  <span className="runner-face">
                    <span className="eye eye-left">
                      <span className="pupil" />
                    </span>
                    <span className="eye eye-right">
                      <span className="pupil" />
                    </span>
                    <span className="mouth" />
                  </span>
                </span>
              </div>
            </div>
            <div className="thrower thrower-mongo">
              <span className="thrower-label">MongoDB</span>
              <div className="runner-body thrower-body">
                <span className="runner-head thrower-head" ref={mongoHeadRef}>
                  <span className="runner-face">
                    <span className="eye eye-left">
                      <span className="pupil" />
                    </span>
                    <span className="eye eye-right">
                      <span className="pupil" />
                    </span>
                    <span className="mouth" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="snowball snowball-1" ref={snow1Ref} />
          <div className="snowball snowball-2" ref={snow2Ref} />
          <div className="snowball snowball-3" ref={snow3Ref} />
        </div>
          <div className="global-runner runner-angular" ref={angularRef}>
            <span className="runner-letter">Angular</span>
            <div className="runner-body">
              <span className="runner-head">
                <span className="runner-face">
                  <span className="eye eye-left">
                    <span className="pupil" />
                  </span>
                  <span className="eye eye-right">
                    <span className="pupil" />
                  </span>
                  <span className="mouth" />
                </span>
              </span>
              {hitTarget === "angular" && <span className="hit-bubble">ayy</span>}
            </div>
          </div>
          <div className="global-runner runner-react" ref={reactRef}>
            <span className="runner-letter">React</span>
            <div className="runner-body">
              <span className="runner-head">
                <span className="runner-face">
                  <span className="eye eye-left">
                    <span className="pupil" />
                  </span>
                  <span className="eye eye-right">
                    <span className="pupil" />
                  </span>
                  <span className="mouth" />
                </span>
              </span>
              {hitTarget === "react" && <span className="hit-bubble">ayy</span>}
            </div>
          </div>
        </div>
      )}
      <header className="hero">
        <div className="hero-content">
          <span className="badge">Senior Frontend / Full‑Stack Developer</span>
          <h1 className="hero-title">Babken Pokrikyan</h1>
          <p className="hero-subtitle">
          Front-end / Full-Stack Engineer with 7+ years of experience delivering scalable enterprise platforms, complex business applications, and high-performance front-end architectures using Angular, React, and TypeScript.
          </p>
          <div className="hero-meta">
            <span>📍 Armenia (Open to Remote)</span>
            <span>📧 babkenpokrikyan@gmail.com</span>
            <span>📞 +374 95 203234</span>
            <a
              href="https://linkedin.com/in/babkenpokrikyan"
              target="_blank"
              rel="noreferrer"
              className="link-chip"
            >
              🔗 LinkedIn
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-inner">
            <p className="hero-card-title">Tech Snapshot</p>
            <ul className="hero-card-list">
              <li>Angular, React, TypeScript, NgRx, Redux, RxJS, Tailwind CSS, Bootstrap, Material UI</li>
              <li>Node.js, REST APIs, MongoDB</li>
              <li>Code Reviews, Refactoring, Version Upgrades</li>
              <li>Performance & Bundle Optimization</li>
              <li>Agile/Scrum, Remote Collaboration</li>
              <li>Clean Architecture & State Management</li>
              <li>Accessibility, Performance, Code Reviews</li>
            </ul>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="section fade-in">
          <h2 className="section-title">Core Competencies</h2>
          <div className="grid">
            <div className="card">
              <h3>Frontend</h3>
              <p>
                Angular (2+), React.js, NgRx, RxJS, TypeScript, JavaScript (ES6+), HTML5, CSS3,
                Angular Material, Ant Design, Tailwind CSS, Bootstrap, Material UI
              </p>
            </div>
            <div className="card">
              <h3>Backend</h3>
              <p>Node.js, ExpressJS, REST APIs</p>
            </div>
            <div className="card">
              <h3>Database</h3>
              <p>MongoDB</p>
              <p>SQL</p>
            </div>
            <div className="card">
              <h3>Engineering Practices</h3>
              <p>
                Clean Architecture, State Management, Accessibility (ARIA), Performance
                Optimization, Code Reviews, Version Upgrades, Agile/Scrum
              </p>
            </div>
          </div>
        </section>

        <section className="section fade-in">
          <h2 className="section-title">Professional Experience</h2>

          <article className="experience-card">
            <header className="experience-header">
              <div>
                <h3>Senior Full‑Stack Developer</h3>
                <p className="company">
                  Benekiva / FreeDOM Development · US – Remote · 2018 – 2026
                </p>
              </div>
              <span className="pill">Enterprise Insurance Platform</span>
            </header>
            <ul className="bullet-list">
              <li>
                Lead development of an enterprise‑level insurance platform used in the US market.
              </li>
              <li>
                Architected and implemented scalable frontend modules using Angular and RxJS.
              </li>
              <li>Contributed to backend services using Node.js and MongoDB.</li>
              <li>Led a team of 5 developers, managing sprint cycles and technical planning.</li>
              <li>Conducted detailed code reviews and enforced high engineering standards.</li>
              <li>
                Improved accessibility compliance (ARIA, semantic HTML, keyboard navigation).
              </li>
              <li>
                Managed major framework and dependency upgrades to ensure long‑term maintainability.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <header className="experience-header">
              <div>
                <h3>Frontend Developer</h3>
                <p className="company">Iunetworks · Yerevan · 2021 – 2023</p>
              </div>
              <span className="pill">Governmental Tax System</span>
            </header>
            <ul className="bullet-list">
              <li>Developed a large‑scale governmental Tax System platform.</li>
              <li>Built complex dynamic forms with advanced validations and workflows.</li>
              <li>Integrated REST APIs and implemented reusable component architecture.</li>
              <li>
                Collaborated with product owners, BAs, and UX teams to deliver business‑aligned
                solutions.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <header className="experience-header">
              <div>
                <h3>Freelance Frontend Developer (React.js)</h3>
                <p className="company">2025 - Present</p>
              </div>
              <span className="pill">React + Ant Design</span>
            </header>
            <ul className="bullet-list">
              <li>Built a modern frontend application using React.js and Ant Design.</li>
              <li>Designed frontend architecture and a reusable UI component library.</li>
              <li>Integrated backend APIs and optimized performance and responsiveness.</li>
            </ul>
          </article>
        </section>

        <section className="section fade-in">
          <h2 className="section-title">Education</h2>
          <div className="card">
            <h3>Bachelor’s Degree in Management Information Systems</h3>
            <p>Armenian State University of Economics</p>
          </div>
        </section>

        <section className="section fade-in">
          <h2 className="section-title">Languages</h2>
          <div className="languages">
            <span className="chip">Armenian (Native)</span>
            <span className="chip">English (Upper Intermediate)</span>
            <span className="chip">Russian (Upper Intermediate)</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Available for remote opportunities.</span>
        <span>Let’s build something impactful.</span>
      </footer>
    </div>
  );
};

