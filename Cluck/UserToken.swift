import Foundation

/// Авторизационный токен пользователя. Singleton.
class UserToken {
  
  static let instance = UserToken()
  private init() {}

  /// Авторизационный токен. Хранится в локальном хранилище (userDefaults)
  var token: String {
    
    get {
      if let t = app.userDefaults.object(forKey: "token") as? String {
        return t
      } else {
        return ""
      }
    }
    
    set {
      app.userDefaults.set(newValue, forKey: "token")
    }
  }
}
