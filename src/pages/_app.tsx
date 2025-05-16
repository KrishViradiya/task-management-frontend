// For Pages Router (Legacy Next.js)
// frontend/src/pages/_app.tsx
import { AppProps } from 'next/app';
import { ReduxProvider } from '../providers/ReduxProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

export default MyApp;