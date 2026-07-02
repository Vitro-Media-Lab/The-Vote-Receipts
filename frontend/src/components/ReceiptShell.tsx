const TOP_POINTS =
  "0,16 200,16 200,8 195,0 190,8 185,0 180,8 175,0 170,8 165,0 160,8 155,0 150,8 145,0 140,8 135,0 130,8 125,0 120,8 115,0 110,8 105,0 100,8 95,0 90,8 85,0 80,8 75,0 70,8 65,0 60,8 55,0 50,8 45,0 40,8 35,0 30,8 25,0 20,8 15,0 10,8 5,0 0,8";
const BOTTOM_POINTS =
  "0,0 200,0 200,8 195,16 190,8 185,16 180,8 175,16 170,8 165,16 160,8 155,16 150,8 145,16 140,8 135,16 130,8 125,16 120,8 115,16 110,8 105,16 100,8 95,16 90,8 85,16 80,8 75,16 70,8 65,16 60,8 55,16 50,8 45,16 40,8 35,16 30,8 25,16 20,8 15,16 10,8 5,16 0,8";

export default function ReceiptShell({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="text-receipt-text rounded-sm shadow-lg max-w-lg w-full mx-auto"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="w-full h-4 block">
        <polygon points={TOP_POINTS} fill="#fffef5" />
      </svg>
      <div
        className="bg-receipt-bg px-5 pb-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 28px)",
        }}
      >
        {children}
      </div>
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="w-full h-4 block">
        <polygon points={BOTTOM_POINTS} fill="#fffef5" />
      </svg>
    </article>
  );
}
