import { Verifier } from '@pact-foundation/pact';
import path from 'path';

export const verifyProvider = async () => {
    const verifier = new Verifier({
        providerBaseUrl: 'http://localhost:6006', // Storybook endpoint or local build
        provider: 'Pointr_Places_API',
        pactUrls: [
            // Path properly intercepting Consumer Pact Outputs mapping correctly
            path.resolve(process.cwd(), 'pacts/KozmosUI_POICard-Pointr_Places_API.json')
        ],
        publishVerificationResult: process.env.CI === 'true',
        providerVersion: process.env.GITHUB_SHA || '1.0.0',
    });

    try {
        await verifier.verifyProvider();
        console.log('Pact verification successful!');
    } catch (error) {
        console.error('Pact verification failed:', error);
        process.exit(1);
    }
};

// Execute the verification
verifyProvider();
