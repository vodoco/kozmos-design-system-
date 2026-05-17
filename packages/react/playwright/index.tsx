import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import '../src/index.css';
import { DesignConfigProvider } from '../src/context/DesignConfigContext';

export type HooksConfig = {
  routing?: boolean;
}

beforeMount(async ({ hooksConfig, App }) => {
  return (
    <DesignConfigProvider>
      <App />
    </DesignConfigProvider>
  );
});
