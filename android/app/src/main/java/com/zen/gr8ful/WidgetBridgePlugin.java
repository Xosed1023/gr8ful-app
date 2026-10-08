package com.zen.gr8ful;

import android.content.Context;
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
}
