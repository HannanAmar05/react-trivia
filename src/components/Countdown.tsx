import { useState, useEffect } from "react";

interface CountdownProps {
  onComplete: () => void;
}

const Countdown = ({ onComplete }: CountdownProps) => {
  const [count, setCount] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setCount(count - 1), 100);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-400 uppercase tracking-widest mb-4">
          Get Ready
        </h2>
        <div
          className={`text-[250px] font-black text-blue-600 transition-all duration-500 transform ${
            isAnimating ? "scale-150 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          {count}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
