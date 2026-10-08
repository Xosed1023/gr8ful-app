package com.zen.gr8ful;

import android.graphics.Color;

/** Paleta del widget por género × esquema; refleja `Gr8fulWidget.swift` y `variables.css`. */
final class WidgetPalette {
    final int base;
    /** Tres manchas de color difuminadas (con su transparencia). */
    final int[] glows;
    final int accent;
    final int text;
    final int muted;

    private WidgetPalette(int base, int[] glows, int accent, int text, int muted) {
        this.base = base;
        this.glows = glows;
        this.accent = accent;
        this.text = text;
        this.muted = muted;
    }

    private static int rgb(int hex) {
        return 0xFF000000 | hex;
    }

    private static int rgba(int hex, double alpha) {
        return ((int) Math.round(alpha * 255) << 24) | (hex & 0xFFFFFF);
    }

    static WidgetPalette of(boolean male, boolean dark) {
        if (!male && !dark) {
            return new WidgetPalette(
                    rgb(0xF8F6F6),
                    new int[] {rgba(0xD9ACFD, 0.60), rgba(0x8DCDFF, 0.55), rgba(0xE8DDFF, 0.70)},
                    rgb(0x5602D3), rgb(0x1B1C1C), rgb(0x6B6578));
        }
        if (!male) {
            return new WidgetPalette(
                    rgb(0x0F1220),
                    new int[] {rgba(0x4A27A8, 0.60), rgba(0x1E5F8A, 0.50), rgba(0x5B3FA8, 0.45)},
                    rgb(0xA58BFF), rgb(0xECEAF4), rgb(0xA9A7BD));
        }
        if (!dark) {
            return new WidgetPalette(
                    rgb(0xF8F6F6),
                    new int[] {rgba(0x89CEFF, 0.65), rgba(0x39B8FD, 0.40), rgba(0xCAE6FF, 0.75)},
                    rgb(0x006493), rgb(0x1B1C1C), rgb(0x5B6B78));
        }
        return new WidgetPalette(
                rgb(0x0C1520),
                new int[] {rgba(0x1E5F8A, 0.65), rgba(0x006493, 0.50), rgba(0x183C5C, 0.55)},
                rgb(0x8FC4E8), rgb(0xECEAF4), rgb(0xA9B7C4));
    }

    /** El mismo color sin opacidad, para el final transparente de cada degradado. */
    static int transparent(int color) {
        return Color.argb(0, Color.red(color), Color.green(color), Color.blue(color));
    }
}
