package com.zen.gr8ful;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.Calendar;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Contenido del widget: lo que la app web entrega ya resuelto (payload v1, el mismo que lee
 * el widget de iOS): idioma, género y una frase por día.
 */
final class WidgetData {
    static final String PREFS = "gr8ful_widget";
    static final String KEY = "widgetData";

    final String language; // "es" | "en" | "fr"
    final boolean male; // "M" decide la paleta
    /** `null` = la app aún no preparó contenido: se muestra el mensaje de bienvenida. */
    final String quote;
    final String author;

    private WidgetData(String language, boolean male, String quote, String author) {
        this.language = language;
        this.male = male;
        this.quote = quote;
        this.author = author;
    }

    static WidgetData empty() {
        return new WidgetData("en", false, null, "");
    }

    /** Clave del día local, `YYYY-MM-DD` (igual que `dateKey` de la app). */
    static String todayKey() {
        Calendar c = Calendar.getInstance();
        return String.format(
                Locale.US, "%04d-%02d-%02d", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1, c.get(Calendar.DAY_OF_MONTH));
    }

    /** Lee el contenido guardado; cualquier dato ausente o corrupto devuelve el estado vacío. */
    static WidgetData load(Context context, String today) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String raw = prefs.getString(KEY, null);
            if (raw == null) return empty();
            JSONObject root = new JSONObject(raw);
            if (root.optInt("v", 0) != 1) return empty();
            JSONArray days = root.getJSONArray("days");
            if (days.length() == 0) return empty();

            String language = root.optString("language", "en");
            boolean male = "M".equals(root.optString("gender", "W"));

            // Hoy; si no está (p. ej. ya pasaron todos los días) la última, o la primera si el reloj va atrasado
            JSONObject chosen = null;
            for (int i = 0; i < days.length(); i++) {
                JSONObject day = days.getJSONObject(i);
                if (today.equals(day.optString("date"))) {
                    chosen = day;
                    break;
                }
            }
            if (chosen == null) {
                JSONObject last = days.getJSONObject(days.length() - 1);
                chosen = last.optString("date").compareTo(today) < 0 ? last : days.getJSONObject(0);
            }
            String quote = chosen.getString("quote");
            if (quote.trim().isEmpty()) return empty();
            return new WidgetData(language, male, quote, chosen.optString("author", ""));
        } catch (Exception e) {
            return empty();
        }
    }

    /** Comillas tipográficas por idioma (en francés llevan espacio fino por dentro). */
    String quoted() {
        if (quote == null) return "";
        switch (language) {
            case "en":
                return "“" + quote + "”";
            case "fr":
                return "« " + quote + " »";
            default:
                return "«" + quote + "»";
        }
    }
}
