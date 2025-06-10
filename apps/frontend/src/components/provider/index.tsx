import { ThemeProvider } from '../theme/theme-provider';
import { QueryProvider } from './query';

export const Providers = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
};
