import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { ROUTES } from "@/lib/seo";

type IconKind = "upload" | "check" | "match" | "download";

function WorkflowIcon({ kind }: { kind: IconKind }) {
  const paths: Record<IconKind, string> = {
    upload: "M12 16V4m-4 4 4-4 4 4M5 15v5h14v-5",
    check: "m7 12 3 3 7-7M8 3H5v18h14V3h-3M9 3h6v4H9z",
    match: "M4 6h10M4 12h7M4 18h10m1-7 3 3 4-5",
    download: "M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4",
  };
  return (
    <svg
      aria-hidden="true"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

export function WorkflowBento() {
  return (
    <div className="workflow-panel">
      <ol className="workflow-grid" aria-label="How to build your resume">
        <li className="workflow-start">
          <Link prefetch={false} href={ROUTES.build} className="workflow-card">
            <div className="workflow-card-top">
              <span className="workflow-icon">
                <WorkflowIcon kind="upload" />
              </span>
              <span aria-hidden>↗</span>
            </div>
            <h3>Start with what you have.</h3>
            <p>Import a resume or choose a blank template.</p>
            <div className="workflow-file-types" aria-hidden="true">
              <span>PDF</span>
              <span>DOCX</span>
              <span>TXT</span>
            </div>
          </Link>
        </li>
        <li className="workflow-details">
          <div className="workflow-resume-stack" aria-hidden="true">
            <div className="workflow-resume-back" />
            <div className="workflow-resume-front">
              <BrandMark />
              <span className="workflow-sample-name">John Doe</span>
              <span className="workflow-sample-role">Software Engineer</span>
              <div className="workflow-paper-lines">
                <i />
                <i />
                <i />
              </div>
              <span className="workflow-sample-section">Experience</span>
              <div className="workflow-paper-lines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <span className="workflow-sample-section">Skills</span>
              <div className="workflow-paper-lines">
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="workflow-details-copy">
            <h3>Put it in order.</h3>
            <p>Edit your details. See each change in the preview.</p>
            <Link
              prefetch={false}
              href={ROUTES.build}
              className="btn btn-primary"
            >
              Build resume <span aria-hidden>↗</span>
            </Link>
          </div>
        </li>
        <li className="workflow-check">
          <Link
            prefetch={false}
            href={ROUTES.atsChecker}
            className="workflow-card"
          >
            <div className="workflow-card-top">
              <span className="workflow-icon">
                <WorkflowIcon kind="check" />
              </span>
              <span aria-hidden>↗</span>
            </div>
            <h3>Check the details.</h3>
            <p>Review your ATS score and suggested fixes.</p>
          </Link>
        </li>
        <li className="workflow-match">
          <Link
            prefetch={false}
            href={ROUTES.atsChecker}
            className="workflow-card"
          >
            <div className="workflow-card-top">
              <span className="workflow-icon">
                <WorkflowIcon kind="match" />
              </span>
              <span aria-hidden>↗</span>
            </div>
            <h3>Read the job closely.</h3>
            <p>Compare keywords. Add only skills you can back up.</p>
          </Link>
        </li>
        <li className="workflow-download">
          <Link prefetch={false} href={ROUTES.build} className="workflow-card">
            <div className="workflow-card-top">
              <span className="workflow-icon">
                <WorkflowIcon kind="download" />
              </span>
              <span aria-hidden>↗</span>
            </div>
            <h3>Save your resume.</h3>
            <p>Choose the file format the job posting asks for.</p>
            <div className="workflow-export-files" aria-hidden="true">
              <span>PDF</span>
              <span>DOCX</span>
              <span>LaTeX</span>
            </div>
          </Link>
        </li>
      </ol>
    </div>
  );
}
