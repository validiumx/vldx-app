import Image from 'next/image'

interface LogoAnimationProps {
  isActive?: boolean;
  isAnimated?: boolean;
  logoSrc: string;
  altText?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

export default function LogoAnimation({
  isActive = false,
  isAnimated = true,
  logoSrc,
  altText = "App Logo",
  width = 150,
  height = 150,
  className = "",
  onClick,
}: LogoAnimationProps) {
  if (!logoSrc) {
    console.warn("LogoAnimation: Prop 'logoSrc' not provided.");
    return null;
  }

  return (
    <div
      className={`relative inline-block font-mono font-bold ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Animated Glow Pulse: biru lebih jelas di bawah putih */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <span className="block w-full h-full rounded-full blur-xl opacity-70 bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <span className="block w-full h-full rounded-full blur-xl opacity-20 bg-white animate-pulse" />
      </div>
      {/* Logo image with optional pulse and movement */}
      <div className={`relative z-10 rounded-full overflow-hidden flex items-center justify-center ${isActive ? "animate-pulse" : ""} ${isAnimated ? "animate-pop-in-out" : ""}`}>
        <Image
          src={logoSrc}
          alt={altText}
          width={width}
          height={height}
          priority
        />
      </div>
    </div>
  );
}