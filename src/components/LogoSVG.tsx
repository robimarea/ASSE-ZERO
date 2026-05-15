interface LogoSVGProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  outlineColor?: string;
  outlineWidth?: number;
}

export function LogoSVG({
  className = '',
  width = '100%',
  height = 'auto',
  color = '#e9ac06', // Giallo (30%)
  outlineColor = '#000000', // Nero (60%)
  outlineWidth = 8,
}: LogoSVGProps) {
  return (
    <svg
      viewBox="0 0 600 120"
      width={width}
      height={height}
      className={`${className} overflow-visible`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .logo-text {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 110px;
            font-weight: 900;
            letter-spacing: -2px;
            text-transform: uppercase;
            paint-order: stroke fill;
          }
        `}
      </style>
      
      {/* Shadow/Outline Effect */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="logo-text"
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      >
        ASSE ZERO
      </text>
    </svg>
  );
}
