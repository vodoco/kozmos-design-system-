package com.kozmos.components

/**
 * The difference a golden recorded on macOS may show on CI's Linux runner and
 * still pass: 0.0001 %. Paparazzi's OffByTwo differ counts only the pixels more
 * than two levels off in a channel, as a percentage of every channel's range.
 * Measured on 2026-09-22 from CI's delta images, the macOS goldens that failed
 * on Linux did so by 2 to 20 such pixels — a location marker's gradient, a
 * disabled label's antialiasing — 0.000002 % to 0.000028 %. The smallest real
 * change measured the same way, the stepper's accent moving from theme/500 to
 * theme/600, is 0.087 %. So this lets the two renderers' rounding through and
 * holds any change a reviewer could see; a snapshot whose rounding grows past
 * it fails, it does not pass quietly. A test that passes at 0.0 on both systems
 * keeps 0.0.
 */
const val CROSS_PLATFORM_MAX_PERCENT_DIFFERENCE = 0.0001
