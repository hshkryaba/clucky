import Foundation
import UIKit
import SystemConfiguration
import Magic

typealias APICompletion     = (() -> Void)
typealias APIFallback       = ((Error) -> Void)
typealias APIJsonCompletion = ((_ data: JsonDictionary) -> Void)

public typealias JsonDictionary = [String: Any]
public typealias JsonArray = [Any]

var user = User()

class API: NSObject, URLSessionDataDelegate {
  let baseURL = URL(string: "http://185.244.173.142/api/")!
  // let baseURL = URL(string: "http://185.244.173.142/")!
  
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
  
  // TODO: Вынести в сервис
  /// Создание самого запроса к API. Отправка же запроса происходит в методе SendRequest
  /// - Parameters:
  ///   - method: Тип запроса: GET, POST, PUT, DELETE и так далее
  ///   - path: Адрес куда в дальнейшем будет отправлен запрос
  ///   - tokenRequired: Для некоторых запросов не требуется авторизационный токен
  ///   - serialize: TODO: дописать
  func makeRequest(method: String, path: String, parameters: [String: Any]? = nil, tokenRequired: Bool = false, serialize: Bool = false) -> URLRequest {
    
    var urlComponents   = URLComponents()
    urlComponents.path  = path
    
    // Если запрос на получение данных
    if (method == "GET" ) {
      if let bParameters = parameters {
        urlComponents.query = serializeParameters(parameters: bParameters)
      }
    }
    
    /// Наш базоый адрес API
    let requestURL      = urlComponents.url(relativeTo: baseURL)!
    
    /// Объект запроса...
    var request         = URLRequest(url: requestURL)
    // ... с установленным методом отправки данных
    request.httpMethod  = method
    
    // Natali added
    // request.setValue("ios-2.8.5", forHTTPHeaderField: "X-APP")
    
    // Если запрос на отправку данных
    if (method == "POST" || method == "PUT") {
      
      if let bParameters = parameters {
        if (serialize) {
          
          // Задаём особенности отправки данных. Обычный формат.
          request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
          
          // Само тело запроса. 
          request.httpBody = serializeParameters(parameters: bParameters).data(using: .utf8, allowLossyConversion: true)
          
          //request.httpBody = try! JSONSerialization.data(withJSONObject: bParameters, options: [])
        
        } else {
          
          // Задаём особенности отправки данных. Отправка данных в формате JSON.
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.httpBody = collectJSONData(parameters: bParameters)
          //request.httpBody = try! JSONSerialization.data(withJSONObject: bParameters, options: [])
        }
      }
      
      // Указание длины запроса
      if let length = request.httpBody?.count {
        request.setValue("\(length)", forHTTPHeaderField: "Content-Length")
      }
    }
    
    // Если API требует наличие токена для совершения запроса - передаём его
    if (tokenRequired) {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }
    
    return request
  }
  
  
  // TODO: Вынести в сервис
  /// Отправка запроса к API
  /// - Parameters:
  ///   - request: объект запроса к API
  ///   - completion: убегающее замыкание, что исполняется после завершения функции. Возвращает ответ в формате JsonDictionary
  ///   - fallback: обработка возможной ошибки
  ///   - withoutProcessing: TODO
  func sendRequest(request: URLRequest, completion: @escaping ((JsonDictionary) -> Void), fallback: APIFallback? = nil, withoutProcessing: Bool = false) {
    
    /// Объект задачи для отправки на сервер. Выполняется в формате замыкания.
    let task = session.dataTask(with: request) { (data, response, error) in
      
      // Запуск в основной очереди
      app.mainQueue.addOperation({
        
        // Todo: расписать - что здесь, собственно, происходит
        self.decreaseNetworkActivityCounter()
        
        // Если мы получили какие-либо данные после запроса к серверу, оборачиваем их в константу
        if let responseData = data {
          
          // Todo: без некой проверки
          if withoutProcessing {
            
            // TODO: comment
            if let json = self.parseJSON(data: responseData) as? JsonDictionary {
              completion(json)
            }
            
            // Todo: с некой таинственной проверкой 
          } else {
            
            let processed = self.processJsonDictionary(data: responseData)
            
            // Если имеем ошибку, вместо готовго JSON
            if let processedError = processed.0 {
              magic(processedError)
              
              // В противном случае...  
            } else if let json = processed.1 {
              
              // ... отдаём наш итоговый json в убегающее замыкание
              completion(json)
            }
          }
        }
      })
    }
    
    app.mainQueue.addOperation({
      self.increaseNetworkActivityCounter()
    })
    
    // Запуск задачи на выполнение
    task.resume()
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
  
  //MARK: - API requests
  
  /// Получение авторизационного токена, для использования в последующих запросах
  /// - Parameters:
  ///   - username: Имя пользователя (юзернейм/логин)
  ///   - password: Пароль пользователя
  ///   - completion: Сбегающее замыкание, что исполняется после завершения функции. Возвращает ответ в формате JsonDictionary
  ///   - fallback: Обработка возможной ошибки
  func getToken(username: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    
    
    let request = self.makeRequest(method: "POST", path: "api/auth/login", parameters: ["login": username, "password": password], serialize: true)
    
    
    
    self.sendRequest(request: request, completion: { (json) in
      magic("GET TOKEN METHOD \(json)")
      if let result = json["result"] as? NSArray {
        if let tokenDict = result[0] as? NSDictionary {
          if let token = tokenDict["accessToken"] as? String {
            self.token = token
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
    token = ""
    
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
      let request = self.makeRequest(method: "POST", path: "auth/register", parameters: params, serialize: true)
      
      // Отправка запроса к API
      self.sendRequest(request: request, completion: { (json) in
        
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
    let request = self.makeRequest(method: "GET", path: "api/questions", tokenRequired: true)
    self.sendRequest(request: request, completion: { (json) in
      magic("QUESTION LIST JSON \(json)")

      let questionList = Question.insertQuestionList(json: json)
      completion(questionList)
    }, fallback: fallback)
  }
  
  func loadUserInfo(id: Int, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    let request = self.makeRequest(method: "GET", path: "api/users/\(id)", tokenRequired: true)
    self.sendRequest(request: request, completion: { (json) in
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
    do {
      // .mutableContainers: Указывает на то, что массивы и словари создаются как изменяемые объекты.
      return try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject?
    } catch let error {
      magic(error)
      return nil
    }
  }
  
  func collectJSONData(parameters: [String: Any]) -> Data? {
    do {
      let data = try JSONSerialization.data(withJSONObject: parameters, options: JSONSerialization.WritingOptions(rawValue: 0))
      return data
    } catch let error as NSError {
      magic(error)
      return nil
    }
  }

  /// Вспомогательный метод для обработки первоначальных данных перед отправкой запроса на сервер
  func serializeParameters(parameters: [String: Any]) -> String {
    var components = [String]()
    
    // Приводим входящие данные в формат: ключ-значение
    for (key, value) in parameters {
      components.append("\(key)=\(value)")
    }
    
    return components.joined(separator: "&")
  }
}

