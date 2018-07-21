import Foundation
import UIKit
import SystemConfiguration
import Magic

typealias APICompletion     = (() -> Void)
typealias APIFallback       = ((Error) -> Void)
typealias APIJsonCompletion = ((_ data: JsonDictionary) -> Void)

public typealias JsonDictionary = [String: Any]
public typealias JsonArray = [Any]

/// Методы отправки и получения данных от API
var cluckyService = CluckyService()

var user = User()

class API: NSObject, URLSessionDataDelegate {
  /// Особая сессия, в которой отправляются запросы к API
  var session: URLSession!
  
  /// Настройки сессии для отправки запросов к API
  var sessionConfiguration: URLSessionConfiguration
  
  var networkActivityCounter = 0
  
  let responseErrors = [NSURLErrorUnknown,
                        NSURLErrorCancelled,
                        NSURLErrorBadURL,
                        NSURLErrorTimedOut,
                        NSURLErrorUnsupportedURL,
                        NSURLErrorCannotFindHost,
                        NSURLErrorCannotConnectToHost,
                        NSURLErrorNetworkConnectionLost,
                        NSURLErrorDNSLookupFailed,
                        NSURLErrorHTTPTooManyRedirects,
                        NSURLErrorResourceUnavailable,
                        NSURLErrorNotConnectedToInternet,
                        NSURLErrorRedirectToNonExistentLocation,
                        NSURLErrorBadServerResponse,
                        NSURLErrorUserCancelledAuthentication,
                        NSURLErrorUserAuthenticationRequired,
                        NSURLErrorZeroByteResource,
                        NSURLErrorCannotDecodeRawData,
                        NSURLErrorCannotDecodeContentData,
                        NSURLErrorCannotParseResponse]
  
  
  override init() {
    sessionConfiguration = URLSessionConfiguration.default
    sessionConfiguration.allowsCellularAccess = true
    sessionConfiguration.httpMaximumConnectionsPerHost = 2
    super.init()
    session = URLSession(configuration: sessionConfiguration, delegate: self, delegateQueue: .main)
  }
  
  var isReachable: Bool {
    var zeroAddress = sockaddr_in()
    zeroAddress.sin_len = UInt8(MemoryLayout.size(ofValue: zeroAddress))
    zeroAddress.sin_family = sa_family_t(AF_INET)
    
    let defaultRouteReachability = withUnsafePointer(to: &zeroAddress) {
      $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {zeroSockAddress in
        SCNetworkReachabilityCreateWithAddress(nil, zeroSockAddress)
      }
    }
    
    var flags = SCNetworkReachabilityFlags()
    if !SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) {
      return false
    }
    let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
    let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
    return (isReachable && !needsConnection)
  }
  
  func increaseNetworkActivityCounter() {
    networkActivityCounter += 1
    if (networkActivityCounter > 0 ) {
      app.shared.isNetworkActivityIndicatorVisible = true
    }
  }
  
  func decreaseNetworkActivityCounter() {
    if (networkActivityCounter == 0) { return }
    networkActivityCounter -= 1
    if (networkActivityCounter == 0 ) {
      app.shared.isNetworkActivityIndicatorVisible = false
    }
  }
  
  /// Получение авторизационного токена, для использования в последующих запросах
  /// - Parameters:
  ///   - username: Имя пользователя (юзернейм/логин)
  ///   - password: Пароль пользователя
  ///   - completion: Сбегающее замыкание, что исполняется после завершения функции. Возвращает ответ в формате JsonDictionary
  ///   - fallback: Обработка возможной ошибки
  func getToken(username: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    
    let request = cluckyService.makeRequest(method: "POST", path: "api/auth/login", parameters: ["login": username, "password": password], serialize: true)
    
    cluckyService.sendRequest(request: request, completion: { (json) in
      magic("GET TOKEN METHOD \(json)")
      if let result = json["result"] as? NSArray {
        if let tokenDict = result[0] as? NSDictionary {
          if let token = tokenDict["accessToken"] as? String {
            UserToken.instance.token = token
            completion()
          }
        }
      }
    }, fallback: fallback)
  }
  
  /// Авторизация
  /// - Parameters:
  ///   - username: Логин пользователя
  ///   - password: Пароль пользователя
  ///   - completion: Сбегающее замыкание, что исполняется после завершения функции. Возвращает ответ в формате JsonDictionary
  ///   - fallback: Обработка возможной ошибки
  func login(username: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    
    
    getToken(username: username, password: password, completion: {
      //self.createInitUser()
      //self.loginPushRegistration(completion: completion)
      completion()
    }, fallback: fallback)
  }
  
  func logout(queue: OperationQueue? = app.queue) {
    UserToken.instance.token = ""
    
    /*app.ud.set(false, forKey: "AuthorizationStatus")
     app.ud.set(nil, forKey: "userID")
     app.ud.set(nil, forKey: "userPhone")
     app.ud.set(nil, forKey: "userPassword")
     app.ud.set(false, forKey: app.confirmNewRequestAgreementKey)
     
     app = App()
     app.stack.resetStack()
     app.stack.save()
     app.delegate.performTransitionAfterLogout()*/
  }
  
  /// Создане пользователя
  func createInitUser() {
    let user = User()
    UserDefaults.standard.set(user, forKey: "user")
    user.name = ""
    user.emailAddress = ""
    //app.stack.save()
  }
  
  /// Регистрация на сервере через API
  /// - Parameters:
  ///   - queue: Поток
  ///   - email: Email пользователя
  ///   - login: Login пользователя (он же - юзернейм)
  ///   - password: Пароль
  ///   - completion: Сбегающее замыкание. Выполняется уже после окончания работы самой функции
  ///   - fallback: Обработка ошибки внутри функции
  func signup(queue: OperationQueue = app.queue, email: String, login: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    queue.addOperation {
      
      let params = ["login": login, "password": password, "email": email]
      
      //
      let request = cluckyService.makeRequest(method: "POST", path: "api/auth/register", parameters: params, serialize: true)
      
      // Отправка запроса к API
      cluckyService.sendRequest(request: request, completion: { (json) in
        
        if let result = json["result"] as? NSArray {
          if let resultDictionary = result[0] as? NSDictionary {
            
            // В случае если мы получили нормальный ответ от сервера...
            if let id = resultDictionary["id"] as? String {
              
              // ... сохраняем id пользователя в локальное хранилище
              app.userDefaults.set(id, forKey: "userID")
            }
          }
        }
        //  Устанавливает пароль в локальное хранилище
        app.userDefaults.set(password, forKey: "userPassword")
        
        // Завершаем выполнение функции отсутствием какого-либо ответа
        completion()
      }, fallback: fallback
      )
    }
  }
  
  func loadQuestionList(completion: @escaping (([Question]) -> Void), fallback: APIFallback? = nil) {
    let request = cluckyService.makeRequest(method: "GET", path: "api/questions", tokenRequired: true)
    cluckyService.sendRequest(request: request, completion: { (json) in
      magic("QUESTION LIST JSON \(json)")
      
      let questionList = Question.insertQuestionList(json: json)
      completion(questionList)
    }, fallback: fallback)
  }
  
  func loadUserInfo(id: Int, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    let request = cluckyService.makeRequest(method: "GET", path: "api/users/\(id)", tokenRequired: true)
    cluckyService.sendRequest(request: request, completion: { (json) in
      magic("USER JSON \(json)")
      completion()
    }, fallback: fallback)
  }
  
  // TODO: Не совсем понимаю - зачем вообще это необходимо.
  func processJsonDictionary(data: Data) -> (NSError?, JsonDictionary?) {
    if let jsonData = parseJSON(data: data) as? JsonDictionary {
      let processed = processJsonResponse(response: jsonData)
      return (processed.0, processed.1)
    } else {
      return (nil, nil)
    }
  }
  
  /// Парсинг полученного ответа в формате JSON в наш родной и любимый JsonDictionary (или же в ошибку)
  func processJsonResponse(response: JsonDictionary) -> (NSError?, JsonDictionary) {
    
    // TODO: Переписать это дело
    // Если пришёл статус 201, значит пользователь создан
    if let statusCode = response["status"] as? Int {
      if statusCode == 201 {
        return (nil, response)
      } else {
        return (nil, response)
      }
    } else {
      return (nil, response)
    }
  }
  
  /// Превращаем ответ от сервера из Data в Json. В идеале возвращает JsonDictionary.
  func parseJSON(data: Data) -> AnyObject? {
    
    magic(data)
    
    do {
      // .mutableContainers: Указывает на то, что массивы и словари создаются как изменяемые объекты.
      return try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject?
    } catch let error {
      magic(error)
      return nil
    }
  }
}
