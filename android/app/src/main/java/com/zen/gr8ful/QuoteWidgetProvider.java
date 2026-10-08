package com.zen.gr8ful;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RadialGradient;
import android.graphics.RectF;
import android.graphics.Shader;
import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.View;
import android.widget.RemoteViews;
import java.util.Calendar;

/**
 * Widget de la frase del día (2×2). Pinta la frase de hoy que la app dejó guardada
 * (`WidgetData`) con la paleta del género y del esquema del sistema, y se vuelve a pintar a
 * medianoche. Es la versión de Android del widget de iOS.
 */
public class QuoteWidgetProvider extends AppWidgetProvider {
    static final String ACTION_MIDNIGHT = "com.zen.gr8ful.WIDGET_MIDNIGHT";

    private static final int DEFAULT_DP = 160;
    private static final int MAX_BITMAP_PX = 520;
    /** Solo antes de Android 12: desde ahí el launcher redondea las esquinas del widget. */
    private static final float LEGACY_CORNER_DP = 22f;

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) update(context, manager, id);
        scheduleMidnight(context);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager manager, int id, Bundle options) {
        update(context, manager, id);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getAction();
        if (ACTION_MIDNIGHT.equals(action)
                || Intent.ACTION_DATE_CHANGED.equals(action)
                || Intent.ACTION_TIMEZONE_CHANGED.equals(action)
                || Intent.ACTION_TIME_CHANGED.equals(action)) {
            refreshAll(context);
        }
    }

    @Override
    public void onDisabled(Context context) {
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarms != null) alarms.cancel(midnightIntent(context));
    }

    /** Vuelve a pintar todos los widgets colocados (lo llama la app al cambiar el contenido). */
    static void refreshAll(Context context) {
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            int[] ids = manager.getAppWidgetIds(new ComponentName(context, QuoteWidgetProvider.class));
            if (ids.length == 0) return;
            for (int id : ids) update(context, manager, id);
            scheduleMidnight(context);
        } catch (Exception e) {
            // Un fallo del widget nunca debe afectar a la app
        }
    }

    private static void update(Context context, AppWidgetManager manager, int id) {
        try {
            manager.updateAppWidget(id, buildViews(context, manager, id));
        } catch (Exception e) {
            // Se conserva lo que ya hubiera en pantalla
        }
    }

    private static RemoteViews buildViews(Context context, AppWidgetManager manager, int id) {
        WidgetData data = WidgetData.load(context, WidgetData.todayKey());
        boolean dark =
                (context.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                        == Configuration.UI_MODE_NIGHT_YES;
        WidgetPalette palette = WidgetPalette.of(data.male, dark);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quote);
        views.setImageViewBitmap(R.id.widget_bg, drawBackground(context, manager, id, palette));
        views.setInt(R.id.widget_infinity, "setColorFilter", palette.accent);

        if (data.quote != null) {
            String text = data.quoted();
            views.setTextViewText(R.id.widget_quote, text);
            views.setTextColor(R.id.widget_quote, palette.text);
            views.setTextViewTextSize(R.id.widget_quote, TypedValue.COMPLEX_UNIT_SP, quoteSize(text.length()));
            views.setViewVisibility(R.id.widget_author, View.VISIBLE);
            views.setTextViewText(R.id.widget_author, "— " + data.author);
            views.setTextColor(R.id.widget_author, palette.muted);
        } else {
            views.setTextViewText(R.id.widget_quote, context.getString(R.string.widget_empty));
            views.setTextColor(R.id.widget_quote, palette.text);
            views.setTextViewTextSize(R.id.widget_quote, TypedValue.COMPLEX_UNIT_SP, 13f);
            views.setViewVisibility(R.id.widget_author, View.GONE);
        }

        // Tocar el widget abre la app
        Intent open = new Intent(context, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pending =
                PendingIntent.getActivity(context, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(android.R.id.background, pending);
        return views;
    }

    /** Cuerpo de la frase según su longitud, para que quepa en el widget pequeño. */
    private static float quoteSize(int length) {
        if (length <= 45) return 16f;
        if (length <= 75) return 14f;
        if (length <= 110) return 12.5f;
        if (length <= 150) return 11.5f;
        return 10.5f;
    }

    /** Lienzo base con tres manchas de color difuminadas, a la medida real del widget. */
    private static Bitmap drawBackground(Context context, AppWidgetManager manager, int id, WidgetPalette palette) {
        float density = context.getResources().getDisplayMetrics().density;
        Bundle options = manager.getAppWidgetOptions(id);
        boolean landscape =
                context.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        // En vertical el widget mide (ancho mínimo × alto máximo); en horizontal, al revés
        int widthDp = options.getInt(
                landscape ? AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH : AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH,
                DEFAULT_DP);
        int heightDp = options.getInt(
                landscape ? AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT : AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT,
                DEFAULT_DP);
        float wPx = (widthDp > 0 ? widthDp : DEFAULT_DP) * density;
        float hPx = (heightDp > 0 ? heightDp : DEFAULT_DP) * density;
        // Se reduce sin deformar si excede el límite de memoria de los RemoteViews
        float scale = Math.min(1f, MAX_BITMAP_PX / Math.max(wPx, hPx));
        int w = Math.max(64, Math.round(wPx * scale));
        int h = Math.max(64, Math.round(hPx * scale));

        Bitmap bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            float radius = LEGACY_CORNER_DP * density * scale;
            Path clip = new Path();
            clip.addRoundRect(new RectF(0, 0, w, h), radius, radius, Path.Direction.CW);
            canvas.clipPath(clip);
        }
        canvas.drawColor(palette.base);

        // Mismas posiciones y proporciones que en el widget de iOS
        float[][] spots = {{0.10f, 0.05f, 1.07f}, {0.98f, 0.60f, 0.95f}, {0.40f, 1.00f, 1.07f}};
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        for (int i = 0; i < 3; i++) {
            float cx = spots[i][0] * w;
            float cy = spots[i][1] * h;
            float r = spots[i][2] * Math.min(w, h);
            paint.setShader(new RadialGradient(
                    cx, cy, r, palette.glows[i], WidgetPalette.transparent(palette.glows[i]), Shader.TileMode.CLAMP));
            canvas.drawRect(0, 0, w, h, paint);
        }
        return bitmap;
    }

    // ---- Medianoche ----

    private static PendingIntent midnightIntent(Context context) {
        Intent intent = new Intent(context, QuoteWidgetProvider.class).setAction(ACTION_MIDNIGHT);
        return PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Alarma inexacta (no necesita permiso de alarmas exactas) poco después de medianoche. */
    private static void scheduleMidnight(Context context) {
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarms == null) return;
        Calendar next = Calendar.getInstance();
        next.add(Calendar.DAY_OF_YEAR, 1);
        next.set(Calendar.HOUR_OF_DAY, 0);
        next.set(Calendar.MINUTE, 0);
        next.set(Calendar.SECOND, 5);
        next.set(Calendar.MILLISECOND, 0);
        alarms.set(AlarmManager.RTC, next.getTimeInMillis(), midnightIntent(context));
    }
}
