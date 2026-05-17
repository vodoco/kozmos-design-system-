import type { Meta } from '@storybook/react';
import React from 'react';
import * as Tokens from '@kozmos/tokens';

export default {
    title: 'Design System/Tokens/Map',
} as Meta;

const ColorCard = ({ name, value }: { name: string, value: string }) => (
    <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', background: '#fff' }}>
        <div style={{ width: '100%', height: '60px', backgroundColor: value, border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '12px' }} />
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', wordBreak: 'break-all' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{value}</div>
    </div>
);

export const AllTokens = () => {
    const tokens = Object.entries(Tokens).filter(([_, val]) => typeof val === 'string');
    
    const colors = tokens.filter(([key]) => key.startsWith('PrimitivesColors'));
    const semantics = tokens.filter(([key, value]) => (key.startsWith('Semantics') || key.startsWith('Components')) && (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value === 'transparent')));
    const radius = tokens.filter(([key]) => key.startsWith('PrimitivesRadius'));
    const spacing = tokens.filter(([key]) => key.startsWith('PrimitivesSpacing'));
    const typography = tokens.filter(([key]) => key.startsWith('PrimitivesTypography'));

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Kozmos Token Visualizer</h1>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Automatically enumerating exported variables structurally mapped from Style Dictionary pipelines natively.</p>

            <h2 style={{ marginTop: '40px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Primitives: Colors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {colors.map(([key, value]) => <ColorCard key={key} name={key} value={value as string} />)}
            </div>

            <h2 style={{ marginTop: '40px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Semantics & Components</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {semantics.map(([key, value]) => <ColorCard key={key} name={key} value={value as string} />)}
            </div>

            <h2 style={{ marginTop: '40px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Primitives: Radius</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {radius.map(([key, value]) => (
                    <div key={key} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', width: '180px', background: '#fff' }}>
                        <div style={{ height: '60px', background: '#0f172a', borderRadius: value as string, marginBottom: '12px' }} />
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{key}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{value as string}</div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '40px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Primitives: Spacing</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {spacing.map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: value as string, height: '24px', background: '#3b82f6', borderRadius: '4px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', width: '250px' }}>{key}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{value as string}</span>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '40px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Primitives: Typography</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {typography.map(([key, value]) => (
                    <div key={key} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>{key}</div>
                        <div style={{ 
                            fontFamily: key.includes('Family') ? value as string : 'inherit', 
                            fontSize: key.includes('Size') ? (value as string).endsWith('rem') || (value as string).endsWith('px') ? value as string : `${value}px` : '16px', 
                            fontWeight: key.includes('Weight') ? value as string : 'normal' 
                        }}>
                            The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Value: {value as string}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
