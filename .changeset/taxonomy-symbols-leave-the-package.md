---
"@kozmos-ds/icons": minor
"@kozmos-ds/react": minor
---

Take the taxonomy's eight quick-access symbols out of the icon set.

`TaxonomyAmenitySpaceDesk`, `TaxonomyEntranceExit`, `TaxonomyFoodBeverageSpace`,
`TaxonomyParkingSpace`, `TaxonomyRetailSpace`, `TaxonomySecuritySpace`,
`TaxonomyServiceSpaceOffice` and `TaxonomyTransportationSpaceBoardingGate` are
gone, with their `taxonomy-*` registry names and their Code Connect
connections. 1183 icons become 1175.

They were never the design system's to ship. A category symbol belongs to the
venue's taxonomy, which Pointr publishes and versions on its own cadence;
an icon here is drawn once and versioned with the components. Carrying both
meant eight PNGs that went stale the moment a taxonomy release landed.

Read the artwork from the taxonomy instead. Every quick-access category carries
its own `iconUrl`, and the panel's `renderIcon` takes whatever you give it:

```tsx
<BrowseCategoriesPanel
  renderIcon={(category) => <img src={category.iconUrl} alt="" aria-hidden />}
/>
```

`BrowseCategoriesPanel`'s `AviationQuickAccess` story now does exactly this,
against `quick-access/aviation_customer.json` at 10.12.0.

The `Accessibility` and `Utensils` glyphs added in 0.2.0 are unaffected: they
are drawn here and stay.
