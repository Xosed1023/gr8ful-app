package com.zen.gr8ful;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Plugin local: entrega al widget el contenido de la frase del día. La app web guarda sus
 * datos en el WebView, que el widget no puede leer; este plugin escribe el JSON en
 * SharedPreferences y pide redibujar el widget, así los cambios se ven al momento.
 */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void setData(PluginCall call) {
        String json = call.getString("json");
        if (json == null) {
            call.reject("Falta el contenido del widget");
            return;
        }
        Context context = getContext();
        context.getSharedPreferences(WidgetData.PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString(WidgetData.KEY, json)
                .apply();
        QuoteWidgetProvider.refreshAll(context);
        call.resolve();
    }

    /**
     * Pide al launcher fijar el widget en la pantalla de inicio (Android 8+). Devuelve
     * `supported` (el launcher lo admite), `requested` (se lanzó la petición; el sistema pide
     * confirmar) y `alreadyAdded` (ya hay un widget colocado). Si no se admite, la app
     * muestra las instrucciones manuales.
     */
    @PluginMethod
    public void requestPin(PluginCall call) {
        JSObject result = new JSObject();
        result.put("supported", false);
        result.put("requested", false);
        result.put("alreadyAdded", false);
        try {
            Context context = getContext();
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            ComponentName provider = new ComponentName(context, QuoteWidgetProvider.class);
            if (manager.getAppWidgetIds(provider).length > 0) {
                result.put("alreadyAdded", true);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && manager.isRequestPinAppWidgetSupported()) {
                result.put("supported", true);
                result.put("requested", manager.requestPinAppWidget(provider, null, null));
            }
        } catch (Exception e) {
            // Un fallo del widget nunca debe afectar a la app: se responde «no soportado»
        }
        call.resolve(result);
    }
}
