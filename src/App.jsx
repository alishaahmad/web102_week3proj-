import { useState, useMemo } from "react";
import "./App.css";

// ==== Your deck (ordered) ====
// Keep using your own cards; image is optional and shows on the BACK.
const INITIAL_CARDS = [
  { front: "Leclerc + Hamilton", back: "Ferrari", image: "/f1ferrari.png" },
  { front: "Verstappen + Tsunoda", back: "RedBull", image: "/f1redbull.png" },
  { front: "Alonso + Stroll", back: "Aston Martin", image: "/f1am.png" },
  { front: "Sainz + Albon", back: "Williams", image: "/f1williams.png" },
  { front: "Russel + Antonelli", back: "Mercedes", image: "/f1mercedes.png" },
];

// ==== Flip-card component (animated) ====
function Flashcard({ showFront, front, back, image, onFlip, result }) {
  // result: "correct" | "incorrect" | null
  return (
    <div className="flip-scene">
      <button
        type="button"
        className={[
          "flip-card",
          showFront ? "" : "is-flipped",
          result === "correct" ? "is-correct" : "",
          result === "incorrect" ? "is-incorrect" : "",
        ].join(" ")}
        onClick={onFlip}
        aria-label="flashcard"
      >
        {/* FRONT: prompt */}
        <div className="card-face card-front">
          {front}
        </div>

        {/* BACK: answer (+ optional image) */}
        <div className="card-face card-back">
          <p className="answer-text">{back}</p>
          {image && <img src={image} alt={back} className="card-img" />}
        </div>
      </button>
    </div>
  );
}

export default function App() {
  const [cards] = useState(INITIAL_CARDS);
  const [index, setIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null); // "correct" | "incorrect" | null
  const [shakeKey, setShakeKey] = useState(0); // force reflow for shake

  const current = cards[index];
  const total = cards.length;

  const title = "F1 Teams: Guess the Team";
  const description =
    "Type the team for these driver pairs. Submit to check. Flip to reveal.";

  const atStart = index === 0;
  const atEnd = index === total - 1;

  // normalize for comparison
  const norm = (s) => s.toLowerCase().trim();
  const isCorrect = useMemo(() => norm(guess) === norm(current.back), [guess, current]);

  const flipCard = () => setShowFront((s) => !s);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCorrect) {
      setResult("correct");
    } else {
      setResult("incorrect");
      // retrigger shake animation on wrong
      setShakeKey((k) => k + 1);
    }
  };

  const goNext = () => {
    if (atEnd) return;
    setIndex((i) => i + 1);
    resetForNewCard();
  };

  const goPrev = () => {
    if (atStart) return;
    setIndex((i) => i - 1);
    resetForNewCard();
  };

  const resetForNewCard = () => {
    setShowFront(true); // show prompt first
    setGuess("");
    setResult(null);
  };

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1>{title}</h1>
          <p className="muted">{description}</p>
          <p className="muted">
            Card {index + 1} of {total}
          </p>
        </header>

        <main className="main">
          {/* Ordered navigation */}
          <div className="nav-row">
            <button
              className="btn"
              onClick={goPrev}
              disabled={atStart}
              aria-disabled={atStart}
              title={atStart ? "Start of deck" : "Previous"}
            >
              ◀ Prev
            </button>

            <button
              className="btn"
              onClick={flipCard}
              title="Flip card (or click the card)"
            >
              Flip
            </button>

            <button
              className="btn"
              onClick={goNext}
              disabled={atEnd}
              aria-disabled={atEnd}
              title={atEnd ? "End of deck" : "Next"}
            >
              Next ▶
            </button>
          </div>

          {/* Card */}
          <div key={shakeKey} className={result === "incorrect" ? "shake-wrap" : ""}>
            <Flashcard
              showFront={showFront}
              front={current.front}
              back={current.back}
              image={current.image}
              onFlip={flipCard}
              result={result}
            />
          </div>

          {/* Guess box */}
          <form className="guess-row" onSubmit={handleSubmit}>
            <label htmlFor="guess" className="guess-label">
              Your guess:
            </label>
            <input
              id="guess"
              type="text"
              className={[
                "guess-input",
                result === "correct" ? "ok" : "",
                result === "incorrect" ? "bad" : "",
              ].join(" ")}
              placeholder="Type team name (e.g., Ferrari)"
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                if (result) setResult(null);
              }}
              autoComplete="off"
            />
            <button type="submit" className="btn submit-btn">
              Submit
            </button>
          </form>

          {/* Feedback text (optional) */}
          {result === "correct" && (
            <p className="feedback ok">✅ Correct!</p>
          )}
          {result === "incorrect" && (
            <p className="feedback bad">❌ Not quite — try flipping to check.</p>
          )}
        </main>
      </div>
    </div>
  );
}
