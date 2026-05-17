import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, it, expect } from 'vitest';
import path from 'path';

const provider = new PactV3({
    consumer: 'dashboard',
    provider: 'kozmos',
    dir: path.resolve(process.cwd(), 'tests/contracts/pacts')
});

describe('POICard API Pact Consumer', () => {
    it('generates the POICard JSON Contract', async () => {
        provider
            .uponReceiving('a request for POI Card information')
            .withRequest({
                method: 'GET',
                path: '/api/poi/123',
            })
            .willRespondWith({
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    id: MatchersV3.string('123'),
                    title: MatchersV3.string('Main Entrance'),
                    floor: MatchersV3.integer(1),
                    distance: MatchersV3.number(14.5),
                    type: MatchersV3.string('entrance')
                },
            });

        await provider.executeTest(async (mockserver) => {
            const response = await fetch(`${mockserver.url}/api/poi/123`);
            const data = await response.json();
            expect(data.title).toBe('Main Entrance');
        });
    });
});
