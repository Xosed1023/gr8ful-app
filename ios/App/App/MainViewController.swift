import Capacitor
import UIKit

/// Controlador principal del puente de Capacitor. Registra los plugins locales de la app
/// (los de npm se registran solos).
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(WidgetBridgePlugin())
    }
}
