// Buchstaben-Stagger-Hover-Effekt: das Wort steht doppelt übereinander,
// beim Hover schieben sich beide Zeilen nach oben (jeder Buchstabe mit
// eigenem Delay), wodurch die Kopie darunter in Wellenform hochwandert.
export default function StaggerText({ text }: { text: string }) {
  const chars = text.split("");

  const renderChars = () =>
    chars.map((c, i) => (
      <span
        key={i}
        className="stagger-char inline-block"
        style={{ transitionDelay: `${i * 25}ms` }}
      >
        {c === " " ? " " : c}
      </span>
    ));

  return (
    <span className="stagger-text relative inline-block overflow-hidden align-top">
      <span className="block">{renderChars()}</span>
      <span className="absolute left-0 top-full block">{renderChars()}</span>
    </span>
  );
}
