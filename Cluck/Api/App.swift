import Foundation
import UIKit

var app = App()

class App: NSObject {
  let api                 = API()
  let window              = UIApplication.shared.delegate?.window
  let shared              = UIApplication.shared
  var screen              = UIScreen.main
  let storyboard          = UIStoryboard(name: "Main", bundle: nil)
  let delegate            = UIApplication.shared.delegate as! AppDelegate
  let calendar            = Calendar.current
  let mainBundle          = Bundle.main
  
  //let stack = MOGCoreDataStack.stack
  
  let userDefaults        = UserDefaults.standard
  let notificationCenter  = NotificationCenter.default
  let numberFormatter     = NumberFormatter()
  let dateFormatter       = DateFormatter()
  let sumFormatter        = NumberFormatter()
  var totalRequests       = Int.max
  
  //let cache = Cache()
  
  let dadataKey                     = "1d1d9ececd087b20744c457bbbdcf9a03629221a"
  let confirmNewRequestAgreementKey = "confirmNewRequestAgreementKey"
  
  /// Текущий пользователь
  lazy var user: User = {
    return User.current
  }()
  
  /// Основная очередь
  var mainQueue: OperationQueue {
    return OperationQueue.main
  }
  
  /// Обычная очередь
  var queue: OperationQueue {
    return OperationQueue()
  }
  
  // var screenBounds: CGRect {
  //   return UIScreen.main.bounds
  // }
  
  override init() {
    super.init()
    
    sumFormatter.locale = Locale(identifier: "ru_RU")
    sumFormatter.maximumFractionDigits = 0
    sumFormatter.minimumFractionDigits = 0
  }
  
  /** Сравнивает даты без учета времени. 0 - равны */
  
  func compareDateNumbers(date: Date, otherDate: Date) -> ComparisonResult {
    let compsA = app.calendar.dateComponents([.year, .month, .day], from: date)
    let compsB = app.calendar.dateComponents([.year, .month, .day], from: otherDate)

    
    let api = API()
    let window = UIApplication.shared.delegate?.window
    let shared = UIApplication.shared
    var screen = UIScreen.main
    let storyboard = UIStoryboard(name: "Main", bundle: nil)
    let delegate = UIApplication.shared.delegate as! AppDelegate
    let calendar = Calendar.current
    let mainBundle = Bundle.main
    //let stack = MOGCoreDataStack.stack
    let ud = UserDefaults.standard
    let nc = NotificationCenter.default
    let nf = NumberFormatter()
    let df = DateFormatter()
    let sumFormatter = NumberFormatter()
    //let cache = Cache()
    var totalRequests = Int.max
    let dadataKey = "1d1d9ececd087b20744c457bbbdcf9a03629221a"
    let confirmNewRequestAgreementKey = "confirmNewRequestAgreementKey"
    
    /*lazy var user: User = {
        return User.current
    }()*/
    //let user = User.current
    
    var mainQueue: OperationQueue {
        return OperationQueue.main
    }
    
    var queue: OperationQueue {
        return OperationQueue()
    }
    
    let dateA = app.calendar.date(from: compsA)!
    let dateB = app.calendar.date(from: compsB)!
    
    return dateA.compare(dateB)
  }
  
  func validateEmail(email: String) -> Bool {
    var result = false
    
    if email != "" {
      let pattern = NSPredicate(format: "SELF MATCHES %@", "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,16}")
      
      if (pattern.evaluate(with: email)) {
        result = true
      }
    }
    
    return result
  }
}
