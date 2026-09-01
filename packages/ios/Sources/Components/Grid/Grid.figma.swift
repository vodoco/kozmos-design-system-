import SwiftUI
import Figma

struct KozmosGridConnect: FigmaConnect {
    let component = Grid<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=359-1574"

    @FigmaEnum(
        "Columns",
        mapping: [
            "1": 1,
            "2": 2,
            "3": 3,
            "4": 4
        ]
    )
    var columns: Int = 2

    @FigmaEnum(
        "Gap",
        mapping: [
            "2": CGFloat(8),
            "4": CGFloat(16),
            "6": CGFloat(24)
        ]
    )
    var spacing: CGFloat = 16

    var body: some View {
        Grid(cols: self.columns, spacing: self.spacing) {
            AnyView(Color.clear.frame(height: 48))
            AnyView(Color.clear.frame(height: 48))
            AnyView(Color.clear.frame(height: 48))
            AnyView(Color.clear.frame(height: 48))
        }
    }
}
