const CircuitGrid = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5 pointer-events-none circuit-pulse"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="circuit-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 50 L 25 50 L 25 25 L 75 25 L 75 75 L 100 75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
          <circle cx="25" cy="50" r="2" fill="currentColor" className="text-primary" />
          <circle cx="25" cy="25" r="2" fill="currentColor" className="text-primary" />
          <circle cx="75" cy="25" r="2" fill="currentColor" className="text-primary" />
          <circle cx="75" cy="75" r="2" fill="currentColor" className="text-primary" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
    </svg>
  );
};

export default CircuitGrid;
