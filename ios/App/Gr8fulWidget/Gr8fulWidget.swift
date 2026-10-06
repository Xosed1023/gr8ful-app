import SwiftUI
import WidgetKit

// MARK: - Datos compartidos con la app

/// Un día del plan: la frase ya resuelta en el idioma de la app.
struct WidgetDay: Decodable {
    let date: String // yyyy-MM-dd, día local
    let quote: String
    let author: String
}

/// Contenido que escribe la app (esquema v1) en el contenedor del App Group.
struct WidgetPayload: Decodable {
    let v: Int
    let language: String // "es" | "en" | "fr": idioma de la app
    let gender: String // "W" | "M": decide la paleta
    let days: [WidgetDay]
}

enum SharedStore {
    /// Debe coincidir con el App Group de los entitlements y con WidgetBridgePlugin.swift.
    static let group = "group.com.zen.gr8ful.shared"
    static let key = "widgetData"

    static func load() -> WidgetPayload? {
        guard
            let raw = UserDefaults(suiteName: group)?.string(forKey: key),
            let data = raw.data(using: .utf8),
            let payload = try? JSONDecoder().decode(WidgetPayload.self, from: data),
            payload.v == 1
        else { return nil }
        return payload
    }
}

// MARK: - Línea de tiempo: una entrada por día (cambia a medianoche)

struct QuoteEntry: TimelineEntry {
    let date: Date
    let language: String
    let gender: String
    /// `nil` = la app aún no preparó contenido: se muestra el mensaje de bienvenida.
    let quote: String?
    let author: String
}

struct Provider: TimelineProvider {
    private var emptyEntry: QuoteEntry {
        QuoteEntry(date: Date(), language: "en", gender: "W", quote: nil, author: "")
    }

    func placeholder(in context: Context) -> QuoteEntry {
        QuoteEntry(
            date: Date(),
            language: "es",
            gender: "W",
            quote: "El futuro pertenece a quienes creen en la belleza de sus sueños.",
            author: "Eleanor Roosevelt"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (QuoteEntry) -> Void) {
        // En la galería de widgets se enseña una frase de ejemplo
        completion(context.isPreview ? placeholder(in: context) : (entries().first ?? emptyEntry))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuoteEntry>) -> Void) {
        // `.atEnd`: al agotarse las entradas el sistema pide otra línea de tiempo
        completion(Timeline(entries: entries(), policy: .atEnd))
    }

    /// Una entrada por día del plan, desde hoy. Si ya pasaron todos los días del contenido
    /// se conserva el último; sin contenido, el mensaje de bienvenida.
    private func entries() -> [QuoteEntry] {
        guard let payload = SharedStore.load(), !payload.days.isEmpty else { return [emptyEntry] }

        let calendar = Calendar.current
        let parser = DateFormatter()
        parser.calendar = calendar
        parser.locale = Locale(identifier: "en_US_POSIX")
        parser.dateFormat = "yyyy-MM-dd"
        let todayStart = calendar.startOfDay(for: Date())

        func entry(_ day: WidgetDay, at date: Date) -> QuoteEntry {
            QuoteEntry(
                date: date,
                language: payload.language,
                gender: payload.gender,
                quote: day.quote,
                author: day.author
            )
        }

        var result: [QuoteEntry] = []
        for day in payload.days {
            guard let parsed = parser.date(from: day.date) else { continue }
            let dayStart = calendar.startOfDay(for: parsed)
            if dayStart < todayStart { continue }
            // Hoy se muestra desde ya; los días siguientes, a su medianoche
            result.append(entry(day, at: dayStart == todayStart ? Date() : dayStart))
        }

        if result.isEmpty, let last = payload.days.last {
            return [entry(last, at: Date())]
        }
        return result.isEmpty ? [emptyEntry] : result
    }
}

// MARK: - Paleta (refleja src/theme/variables.css y el lienzo de compartir)

struct Palette {
    let base: Color
    let glows: [Color]
    let accent: Color
    let text: Color
    let muted: Color

    init(gender: String, scheme: ColorScheme) {
        let dark = scheme == .dark
        let man = gender == "M"
        switch (man, dark) {
        case (false, false):
            base = Color(hex: 0xF8F6F6)
            glows = [Color(hex: 0xD9ACFD, a: 0.60), Color(hex: 0x8DCDFF, a: 0.55), Color(hex: 0xE8DDFF, a: 0.70)]
            accent = Color(hex: 0x5602D3)
            text = Color(hex: 0x1B1C1C)
            muted = Color(hex: 0x6B6578)
        case (false, true):
            base = Color(hex: 0x0F1220)
            glows = [Color(hex: 0x4A27A8, a: 0.60), Color(hex: 0x1E5F8A, a: 0.50), Color(hex: 0x5B3FA8, a: 0.45)]
            accent = Color(hex: 0xA58BFF)
            text = Color(hex: 0xECEAF4)
            muted = Color(hex: 0xA9A7BD)
        case (true, false):
            base = Color(hex: 0xF8F6F6)
            glows = [Color(hex: 0x89CEFF, a: 0.65), Color(hex: 0x39B8FD, a: 0.40), Color(hex: 0xCAE6FF, a: 0.75)]
            accent = Color(hex: 0x006493)
            text = Color(hex: 0x1B1C1C)
            muted = Color(hex: 0x5B6B78)
        case (true, true):
            base = Color(hex: 0x0C1520)
            glows = [Color(hex: 0x1E5F8A, a: 0.65), Color(hex: 0x006493, a: 0.50), Color(hex: 0x183C5C, a: 0.55)]
            accent = Color(hex: 0x8FC4E8)
            text = Color(hex: 0xECEAF4)
            muted = Color(hex: 0xA9B7C4)
        }
    }
}

extension Color {
    init(hex: UInt32, a: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: a
        )
    }
}

// MARK: - Textos

enum Copy {
    /// El mensaje vacío sigue el idioma del dispositivo: aún no hay preferencia de la app.
    static var deviceLanguage: String {
        Locale.current.language.languageCode?.identifier ?? "en"
    }

    static var emptyMessage: String {
        switch deviceLanguage {
        case "es": return "Abre Gr8ful y tu frase del día aparecerá aquí"
        case "fr": return "Ouvrez Gr8ful et votre citation du jour apparaîtra ici"
        default: return "Open Gr8ful and your daily quote will appear here"
        }
    }

    static var galleryName: String {
        switch deviceLanguage {
        case "es": return "Frase del día"
        case "fr": return "Citation du jour"
        default: return "Daily quote"
        }
    }

    static var galleryDescription: String {
        switch deviceLanguage {
        case "es": return "Una frase nueva cada día, en tu idioma."
        case "fr": return "Une nouvelle citation chaque jour, dans votre langue."
        default: return "A new quote every day, in your language."
        }
    }

    /// Comillas tipográficas por idioma (en francés llevan espacio fino por dentro).
    static func quoted(_ text: String, language: String) -> String {
        switch language {
        case "en": return "\u{201C}\(text)\u{201D}"
        case "fr": return "\u{00AB}\u{00A0}\(text)\u{00A0}\u{00BB}"
        default: return "\u{00AB}\(text)\u{00BB}"
        }
    }
}

// MARK: - Vista

struct QuoteWidgetView: View {
    let entry: QuoteEntry
    @Environment(\.colorScheme) private var scheme

    private var palette: Palette { Palette(gender: entry.gender, scheme: scheme) }

    var body: some View {
        content
            .containerBackground(for: .widget) { background }
    }

    private var content: some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: "infinity")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(palette.accent)

            if let quote = entry.quote {
                Text(Copy.quoted(quote, language: entry.language))
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(palette.text)
                    .lineLimit(6)
                    .minimumScaleFactor(0.55)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)

                Spacer(minLength: 0)

                Text("— \(entry.author)")
                    .font(.system(size: 10, weight: .regular).italic())
                    .foregroundStyle(palette.muted)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            } else {
                Spacer(minLength: 0)
                Text(Copy.emptyMessage)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(palette.text)
                    .minimumScaleFactor(0.7)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 0)
            }
        }
    }

    /// Lienzo con tres manchas de color difuminadas, como el fondo de la app.
    private var background: some View {
        ZStack {
            palette.base
            RadialGradient(
                colors: [palette.glows[0], .clear],
                center: UnitPoint(x: 0.1, y: 0.05),
                startRadius: 0,
                endRadius: 170
            )
            RadialGradient(
                colors: [palette.glows[1], .clear],
                center: UnitPoint(x: 0.98, y: 0.6),
                startRadius: 0,
                endRadius: 150
            )
            RadialGradient(
                colors: [palette.glows[2], .clear],
                center: UnitPoint(x: 0.4, y: 1.0),
                startRadius: 0,
                endRadius: 170
            )
        }
    }
}

// MARK: - Widget

struct Gr8fulWidget: Widget {
    let kind = "Gr8fulDailyQuote"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            QuoteWidgetView(entry: entry)
        }
        .configurationDisplayName(LocalizedStringKey(Copy.galleryName))
        .description(LocalizedStringKey(Copy.galleryDescription))
        .supportedFamilies([.systemSmall])
    }
}

@main
struct Gr8fulWidgetBundle: WidgetBundle {
    var body: some Widget {
        Gr8fulWidget()
    }
}
