// src/types/react-world-flags.d.ts
declare module 'react-world-flags' {
  interface WorldFlagProps {
    code: string;  // ISO country code, e.g., "US", "IN"
    alt?: string;   // Optional alt text for the image
    width?: number;  // Optional width for the flag
    height?: number; // Optional height for the flag
  }

  const WorldFlag: React.FC<WorldFlagProps>;
  export default WorldFlag;
}
