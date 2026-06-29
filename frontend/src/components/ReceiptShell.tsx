const TORN_TOP =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 Q5,0 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5 T110,5 T120,5 T130,5 T140,5 T150,5 T160,5 T170,5 T180,5 T190,5 T200,5 V10 H0 Z' fill='white'/%3E%3C/svg%3E\")";
const TORN_BOTTOM =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 H200 V5 Q195,10 190,5 T180,5 T170,5 T160,5 T150,5 T140,5 T130,5 T120,5 T110,5 T100,5 T90,5 T80,5 T70,5 T60,5 T50,5 T40,5 T30,5 T20,5 T10,5 T0,5 Z' fill='white'/%3E%3C/svg%3E\")";

export default function ReceiptShell({ children }: { children: React.ReactNode }) {
  const maskStyle = (svg: string): React.CSSProperties => ({
    background: "var(--color-receipt-bg)",
    maskImage: svg,
    maskSize: "200px 10px",
    maskRepeat: "repeat-x",
    WebkitMaskImage: svg,
    WebkitMaskSize: "200px 10px",
    WebkitMaskRepeat: "repeat-x",
  });

  return (
    <article
      className="bg-receipt-bg text-receipt-text rounded-sm shadow-lg max-w-lg w-full mx-auto"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 28px)",
      }}
    >
      <div className="h-3 w-full" style={maskStyle(TORN_TOP)} />
      <div className="px-5 pb-5">{children}</div>
      <div className="h-3 w-full" style={maskStyle(TORN_BOTTOM)} />
    </article>
  );
}
