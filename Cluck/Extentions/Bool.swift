import Foundation

extension Bool {
  /// Изменение статуса boolean-объекта с true на false и наборот.
  mutating func toggle() {
    self = !self
  }
}
