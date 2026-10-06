import Capacitor
import WidgetKit

/// Plugin local: entrega al widget el contenido de la frase del día.
///
/// La app web guarda sus datos en el WebView, que la extensión del widget no puede leer. Este
/// plugin escribe el JSON en el contenedor compartido del App Group y pide al sistema que
/// recargue el widget, así los cambios (idioma, temas…) se ven al momento.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setData", returnType: CAPPluginReturnPromise)
    ]

    /// Debe coincidir con el App Group de ambos targets y con `SharedStore.group` del widget.
    private let appGroup = "group.com.zen.gr8ful.shared"
    private let storageKey = "widgetData"

    @objc func setData(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else {
            call.reject("Falta el contenido del widget")
            return
        }
        guard let defaults = UserDefaults(suiteName: appGroup) else {
            call.reject("App Group no disponible")
            return
        }
        defaults.set(json, forKey: storageKey)
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }
}
