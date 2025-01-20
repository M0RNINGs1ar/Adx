// src/types/react-world-flags.d.ts

declare module 'react-world-flags' {
  interface WorldFlagProps {
    code: string;  // ISO country code, e.g., "US", "IN"
    alt?: string;   // Optional alt text for the image
    size?: number;  // Optional size for the flag (in pixels)
  }

  // Define the component and its prop types
  const WorldFlag: React.FC<WorldFlagProps>;

  // Export the component as the default export
  export default WorldFlag;
}
