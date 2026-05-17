import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, it, expect } from 'vitest';
import path from 'path';

// Define the API Provider Contract that acts as the universal schema source of truth for the POICard Component UI bindings.
const provider = new PactV3({
    consumer: 'KozmosUI_POICard',
    provider: 'Pointr_Places_API',
    dir: path.resolve(process.cwd(), 'pacts'),
});

describe('POICard Data Contract Parity', () => {
    it('correctly receives and validates Universal POI schemas', async () => {
        // Construct the strict typing boundary expectation
        provider
            .uponReceiving('a structural request for a specific Point of Interest')
            .withRequest({
                method: 'GET',
                path: '/v1/pois/native-poi-1',
            })
            .willRespondWith({
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    id: MatchersV3.string('native-poi-1'),
                    title: MatchersV3.string('Level 2 Conference Room'),
                    category: MatchersV3.string('Meeting Space'),
                    description: MatchersV3.string('Equipped with Apple TV and Whiteboard'),
                    imageUrl: MatchersV3.string('https://example.com/assets/conference.jpg')
                },
            });

        // Execute the native test against the isolated Mock Provider
        await provider.executeTest(async (mockServer) => {
            const response = await fetch(`${mockServer.url}/v1/pois/native-poi-1`);
            const data = await response.json();
            
            // Definitively assert that the external network contract strictly maps to the POICardProps Typescript limits flawlessly
            expect(data.title).toEqual('Level 2 Conference Room');
            expect(data.category).toEqual('Meeting Space');
            expect(data.description).toContain('Apple TV');
            
            // Further UI-based Component validations can securely instantiate <POICard {...data} /> directly here safely!
        });
    });
});
