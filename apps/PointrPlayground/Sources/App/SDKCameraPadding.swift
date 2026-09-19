import UIKit
import Kozmos

/// Camera padding for the Pointr map: what the shell's chrome covers, plus
/// room for the selected place's pin.
///
/// PointrKit's `focusPoi` centres a place's anchor in the map's inset
/// viewport — measured on Design-QA, to the point. The highlighted marker is a
/// pin drawn upward from that anchor, so centring the anchor put half the free
/// band above it: 79.8pt at the medium detent, for a pin 95.2pt tall, and the
/// pin's head went under the search bar. Adding the pin's height to the top
/// padding centres the pin instead of its anchor.
enum SDKCameraPadding {
    /// Height of PointrKit 10.3.0's highlighted POI pin above its anchor: a
    /// 72pt disc whose top sits 95.2pt above the anchor, measured on the
    /// Design-QA style at `focusPoi`'s zoom. PointrKit exposes no geometry for
    /// its markers, so re-measure this after a PointrKit or style update.
    static let selectedPinHeight: CGFloat = 96

    static func contentInset(
        chrome: KozmosMapCollisionInsets,
        mapHeight: CGFloat,
        hasSelection: Bool
    ) -> UIEdgeInsets {
        let top = CGFloat(chrome.top)
        let bottom = CGFloat(chrome.bottom)
        var paddedTop = top
        if hasSelection {
            paddedTop += selectedPinHeight
            // A free band shorter than the pin cannot show all of it. Rest the
            // anchor on the band's lower edge, so as much of the pin shows as
            // the chrome allows. An unmeasured map has no band to fit.
            if mapHeight > 0 {
                paddedTop = min(paddedTop, max(mapHeight - bottom, top))
            }
        }
        return UIEdgeInsets(top: paddedTop, left: CGFloat(chrome.left), bottom: bottom, right: CGFloat(chrome.right))
    }
}
