import Foundation
import UIKit
import SystemConfiguration

typealias APICompletion = (() -> Void)
typealias APIFallback = ((Error) -> Void)
typealias APIJsonCompletion = ((_ data: JsonDictionary) -> Void)

public typealias JsonDictionary = [String: Any]
public typealias JsonArray = [Any]

var user = User()



class API: NSObject, URLSessionDataDelegate {
  
  let baseURL = URL(string: "http://185.244.173.142/")!
  
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
  
  var session: URLSession!
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
  
  //MARK: - HTTP Client
  
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
  
  /*lazy var unreachableError: NSError = {
   return "Connection failed"
   }()*/
  
  
  func makeRequest(method: String, path: String, parameters: [String: Any]? = nil, tokenRequired: Bool = false, serialize: Bool = false) -> URLRequest {
    var comps = URLComponents()
    comps.path = path
    
    if (method == "GET" ) {
      if let bParameters = parameters {
        comps.query = serializeParameters(parameters: bParameters)
      }
    }
    
    let requestURL = comps.url(relativeTo: baseURL)!
    var request = URLRequest(url: requestURL)
    request.httpMethod = method
    
    //Natali added
    //request.setValue("ios-2.8.5", forHTTPHeaderField: "X-APP")
    
    if (method == "POST" || method == "PUT") {
      if let bParameters = parameters {
        if (serialize) {
          request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
          request.httpBody = serializeParameters(parameters: bParameters).data(using: .utf8, allowLossyConversion: true)
          //request.httpBody = try! JSONSerialization.data(withJSONObject: bParameters, options: [])
        } else {
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.httpBody = collectJSONData(parameters: bParameters)
          //request.httpBody = try! JSONSerialization.data(withJSONObject: bParameters, options: [])
        }
      }
      if let length = request.httpBody?.count {
        request.setValue("\(length)", forHTTPHeaderField: "Content-Length")
      }
    }
    
    if (tokenRequired) {
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }
    
    /*if let authData = "\(authLogin):\(authPassword)".data(using: .utf8) {
     let authString = authData.base64EncodedString()
     request.setValue("Basic \(authString)", forHTTPHeaderField: "Authorization")
     }*/
    
    return request
  }
  
  
  func passRequest(request: URLRequest, completion: @escaping ((JsonDictionary) -> Void), fallback: APIFallback? = nil, withoutProcessing: Bool = false) {
    /*if isReachable {
     app.mainQueue.addOperation({
     app.delegate.hideConnectionError()
     })
     } else {
     app.mainQueue.addOperation({
     app.delegate.showConnectionError()
     })
     return
     }*/
    
    let task = session.dataTask(with: request) { (data, response, error) in
      app.mainQueue.addOperation({
        
        NSLog("RESPONSE \(response)")
        //print("\(data)")
        
        self.decreaseNetworkActivityCounter()
        
        if let responseData = data {
          //app.delegate.hideConnectionError()
          
          if withoutProcessing {
            if let json = self.parseJSON(data: responseData) as? JsonDictionary {
              completion(json)
            }
          } else {
            let processed = self.processJsonDictionary(data: responseData)
            if let processedError = processed.0 {
              /*if processedError.code == APIError.ExpiredToken.code {
               self.logout()
               } else {
               fallback?(processedError)
               }*/
            } else if let json = processed.1 {
              completion(json)
            }
          }
        } else if let responseError = error as NSError? {
          /*if responseError.code == NSURLErrorNotConnectedToInternet {
           app.delegate.showConnectionError()
           } else {
           app.delegate.hideConnectionError()
           fallback?(responseError)
           }*/
        }
      })
    }
    
    app.mainQueue.addOperation({
      self.increaseNetworkActivityCounter()
    })
    
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
  
  //MARK: Authorization
  
  func getToken(login: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    let request = self.makeRequest(method: "POST", path: "api/auth/login", parameters: ["login": login, "password": password], serialize: true)
    self.passRequest(request: request, completion: { (json) in
      print("GET TOKEN METHOD \(json)")
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
  
  func login(login: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    getToken(login: login, password: password, completion: {
      //self.createInitUser()
      //self.loginPushRegistration(completion: completion)
      completion()
    }, fallback: fallback)
  }
  
  /*func loginPushRegistration(completion: @escaping APICompletion) {
   if #available(iOS 8.0, *) {
   if app.shared.isRegisteredForRemoteNotifications {
   if let deviceToken = app.ud.object(forKey: kPushToken) as? String {
   app.api.profile.registerDevice(token: deviceToken, completion: {
   completion()
   }, fallback: { (error) in
   app.log(error: error)
   completion()
   })
   } else {
   app.shared.registerUserNotificationSettings(UIUserNotificationSettings(types: [.sound, .alert, .badge], categories: nil))
   app.shared.registerForRemoteNotifications()
   completion()
   }
   } else {
   app.shared.registerUserNotificationSettings(UIUserNotificationSettings(types: [.sound, .alert, .badge], categories: nil))
   app.shared.registerForRemoteNotifications()
   completion()
   }
   } else {
   let types = app.shared.enabledRemoteNotificationTypes()
   if types == .none {
   app.shared.registerForRemoteNotifications(matching: [.sound, .alert, .badge])
   completion()
   } else {
   if let deviceToken = app.ud.object(forKey: "refreshToken") as? String {
   app.api.profile.registerDevice(token: deviceToken, completion: {
   completion()
   }, fallback: { (error) in
   app.log(error: error)
   completion()
   })
   } else {
   app.shared.registerForRemoteNotifications(matching: [.sound, .alert, .badge])
   completion()
   }
   }
   }
   }*/
  
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
    user.lastName = ""
    user.emailAddress = ""
    //app.stack.save()
  }
  
  /// Регистрация на сервере через API
  func signup(queue: OperationQueue = app.queue, email: String, login: String, password: String, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    queue.addOperation {
      let params = ["login": login, "password": password, "email": email]
      let request = self.makeRequest(method: "POST", path: "auth/register", parameters: params, serialize: true)
      self.passRequest(request: request, completion: { (json) in
        print("REGISTRATION JSON \(json)")
        if let result = json["result"] as? NSArray {
          if let resultDict = result[0] as? NSDictionary {
            if let id = resultDict["id"] as? String {
              app.userDefaults.set(id, forKey: "userID")
            }
          }
        }
        app.userDefaults.set(password, forKey: "userPassword")
        completion()
      }, fallback: fallback)
    }
  }
  
  
  
  //MARK: - Question List
  
  func loadQuestionList(completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    let request = self.makeRequest(method: "GET", path: "api/questions", tokenRequired: true)
    self.passRequest(request: request, completion: { (json) in
      print("QUESTION LIST JSON \(json)")
      completion()
    }, fallback: fallback)
  }
  
  
  //MARK: - USERS
  
  func loadUserInfo(id: Int, completion: @escaping APICompletion, fallback: APIFallback? = nil) {
    let request = self.makeRequest(method: "GET", path: "api/users/\(id)", tokenRequired: true)
    self.passRequest(request: request, completion: { (json) in
      print("USER JSON \(json)")
      completion()
    }, fallback: fallback)
  }
  
  
  //MARK: - JSON
  
  func processJsonDictionary(data: Data) -> (NSError?, JsonDictionary?) {
    if let jsonData = parseJSON(data: data) as? JsonDictionary {
      let processed = processJsonResponse(response: jsonData)
      return (processed.0, processed.1)
    } else {
      return (nil, nil)
    }
  }
  
  func processJsonResponse(response: JsonDictionary) -> (NSError?, JsonDictionary) {
    if let success = response["success"] as? Bool {
      if success {
        return (nil, response)
      } else {
        print(response)
        return (nil, response)
      }
    } else {
      return (nil, response)
    }
  }
  
  func parseJSON(data: Data) -> AnyObject? {
    do {
      return try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject?
    } catch let error {
      //app.log(error: error)
      return nil
    }
  }
  
  func collectJSONData(parameters: [String: Any]) -> Data? {
    do {
      let data = try JSONSerialization.data(withJSONObject: parameters, options: JSONSerialization.WritingOptions(rawValue: 0))
      return data
    } catch let error as NSError {
      //app.log(error: error)
      return nil
    }
  }
  
  
  
  //MARK: - Helping funcs
  
  func serializeParameters(parameters: [String: Any]) -> String {
    var components = [String]()
    for (key, value) in parameters {
      components.append("\(key)=\(value)")
    }
    return components.joined(separator: "&")
  }
  
  
  
  
  
  //MARK: - Session delegate
  
  /*func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
   if (challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodHTTPBasic) {
   let credential = URLCredential(user: authLogin, password: authPassword, persistence: URLCredential.Persistence.permanent)
   completionHandler(URLSession.AuthChallengeDisposition.useCredential, credential)
   } else if (challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust) {
   if let serverTrust = challenge.protectionSpace.serverTrust {
   let credential = URLCredential(trust: serverTrust)
   completionHandler(URLSession.AuthChallengeDisposition.useCredential, credential)
   }
   }
   }*/
  
  
  
  
  
  
  
  
}
