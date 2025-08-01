import { ThemeProvider } from '../context/ThemeProvider';

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

export const ThemeProviderWrapper = ({
  children,
}: ThemeProviderWrapperProps) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
