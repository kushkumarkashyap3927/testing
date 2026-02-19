import React from 'react';
import './App.css';

function App() {

  return (
    <div className="hero">
      <main className="hero-body">
        <h2 className="hero-title">Deterministic BRD generation with data lineage</h2>
        <p className="hero-desc">
          Anvaya.Ai is a "Source-of-Truth" reconciliation engine designed to transform fragmented business
          communications into verified Business Requirements Documents (BRDs). Leveraging a monorepo architecture
          and shared Zod contracts, our platform ingests multi-channel data from Enron emails, AMI transcripts,
          and Slack logs to extract "Atomic Facts." Unlike standard AI summarizers, Anvaya.Ai implements a
          deterministic 5-Stage Pipeline that maps stakeholders, extracts contextual facts with citations,
          detects requirement drift using DAG analysis, triggers HITL resolution, and synthesizes audit-ready
          BRDs with full provenance.
        </p>

        <div className="features">
          <div className="feature">
            <strong>1. Stakeholder Mapping</strong>
            <div>Identifies organizational hierarchy and authority.</div>
          </div>
          <div className="feature">
            <strong>2. Contextual Extraction</strong>
            <div>Maps facts to owners with native citations.</div>
          </div>
          <div className="feature">
            <strong>3. DAG-Based Conflict Detection</strong>
            <div>Identifies "Requirement Drift" with a directed acyclic graph.</div>
          </div>
          <div className="feature">
            <strong>4. HITL Resolution</strong>
            <div>Triggers human-in-the-loop intervention for high-stakes contradictions.</div>
          </div>
          <div className="feature">
            <strong>5. Truth Synthesis</strong>
            <div>Generates an audit-ready BRD linked to original sources.</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;