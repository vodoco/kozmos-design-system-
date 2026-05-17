import fs from 'fs';
import path from 'path';

const missingComponents = [
  'FeedbackCard',
  'FieldWrapper',
  'GlassSettingsPanel',
  'Label',
  'MapControlsGroup',
  'NavigationAnnouncer',
  'RouteSummary',
  'RoutingInputGroup',
  'SaveLocationCard',
  'ScrollArea'
];

const androidMissing = [...missingComponents, 'DynamicIsland'];

const root = process.cwd();

// Generate iOS Stubs
missingComponents.forEach(comp => {
  const dir = path.join(root, 'packages/ios/Sources/Components', comp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const swiftContent = `import SwiftUI

public struct Kozmos${comp}: View {
    public init() {}
    
    public var body: some View {
        Text("${comp}")
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
    }
}
`;
  fs.writeFileSync(path.join(dir, `Kozmos${comp}.swift`), swiftContent);
  console.log(`Created iOS ${comp}`);
});

// Generate Android Stubs
androidMissing.forEach(comp => {
  const dir = path.join(root, 'packages/android/src/main/java/com/kozmos/components', comp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const ktContent = `package com.kozmos.components.${comp}

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun Kozmos${comp}() {
    Text(
        text = "${comp}",
        modifier = Modifier
            .padding(16.dp)
            .background(Color.LightGray.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
            .padding(16.dp)
    )
}
`;
  fs.writeFileSync(path.join(dir, `${comp}.kt`), ktContent);
  console.log(`Created Android ${comp}`);
});
