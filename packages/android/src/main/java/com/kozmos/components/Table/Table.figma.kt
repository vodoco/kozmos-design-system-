package com.kozmos.components.table

import androidx.compose.runtime.Composable
import com.figma.code.connect.Figma
import com.figma.code.connect.FigmaConnect
import com.figma.code.connect.FigmaProperty
import com.figma.code.connect.FigmaType

@FigmaConnect("https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=237-2547")
class KozmosTableConnect {
    @FigmaProperty(FigmaType.Enum, "Density")
    val density: String = Figma.mapping(
        "Default" to "default",
        "Compact" to "compact"
    )

    @FigmaProperty(FigmaType.Text, "Header 1 Text")
    val header1: String = "Name"

    @FigmaProperty(FigmaType.Text, "Header 2 Text")
    val header2: String = "Status"

    @FigmaProperty(FigmaType.Text, "Header 3 Text")
    val header3: String = "Updated"

    @FigmaProperty(FigmaType.Text, "Row 1 Cell 1 Text")
    val row1Cell1: String = "Beacon sync"

    @FigmaProperty(FigmaType.Text, "Row 1 Cell 2 Text")
    val row1Cell2: String = "Ready"

    @FigmaProperty(FigmaType.Text, "Row 1 Cell 3 Text")
    val row1Cell3: String = "Today"

    @FigmaProperty(FigmaType.Text, "Row 2 Cell 1 Text")
    val row2Cell1: String = "Indoor map"

    @FigmaProperty(FigmaType.Text, "Row 2 Cell 2 Text")
    val row2Cell2: String = "Draft"

    @FigmaProperty(FigmaType.Text, "Row 2 Cell 3 Text")
    val row2Cell3: String = "Yesterday"

    @FigmaProperty(FigmaType.Text, "Row 3 Cell 1 Text")
    val row3Cell1: String = "Analytics"

    @FigmaProperty(FigmaType.Text, "Row 3 Cell 2 Text")
    val row3Cell2: String = "Queued"

    @FigmaProperty(FigmaType.Text, "Row 3 Cell 3 Text")
    val row3Cell3: String = "May 21"

    @Composable
    fun ComponentExample() {
        KozmosTable(
            header = {
                KozmosTableRow {
                    KozmosTableHeaderCell(text = header1)
                    KozmosTableHeaderCell(text = header2)
                    KozmosTableHeaderCell(text = header3)
                }
            }
        ) {
            KozmosTableRow {
                KozmosTableCell(text = row1Cell1)
                KozmosTableCell(text = row1Cell2)
                KozmosTableCell(text = row1Cell3)
            }
            KozmosTableRow {
                KozmosTableCell(text = row2Cell1)
                KozmosTableCell(text = row2Cell2)
                KozmosTableCell(text = row2Cell3)
            }
            KozmosTableRow {
                KozmosTableCell(text = row3Cell1)
                KozmosTableCell(text = row3Cell2)
                KozmosTableCell(text = row3Cell3)
            }
        }
    }
}
