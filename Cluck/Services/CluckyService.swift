import Foundation
import Magic

let baseURL = URL(string: "http://185.244.173.142/")!
let api = API()

class CluckyService {
  /// Особая сессия, в которой отправляются запросы к API
  var session: URLSession!
  
  /// Настройки сессии для отправки запросов к API
  var sessionConfiguration: URLSessionConfiguration
  
  init() {
    sessionConfiguration = URLSessionConfiguration.default
    sessionConfiguration.allowsCellularAccess = true
    sessionConfiguration.httpMaximumConnectionsPerHost = 2
    session = URLSession(configuration: sessionConfiguration, delegate: self as? URLSessionDelegate, delegateQueue: .main)
  }
  
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
      if let tempParametersConstant = parameters {
        urlComponents.query = serializeParameters(parameters: tempParametersConstant)
      }
    }
    
    /// Наш базоый адрес API
    let requestURL      = urlComponents.url(relativeTo: baseURL)!
    
    /// Объект запроса...
    var request         = URLRequest(url: requestURL)
    // ... с установленным методом отправки данных
    request.httpMethod  = method
    
    // Если запрос на отправку данных
    if (method == "POST" || method == "PUT") {
      
      if let tempParametersConstant = parameters {
        if (serialize) {
          
          // Задаём особенности отправки данных. Обычный формат.
          request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
          
          // Само тело запроса. 
          request.httpBody = serializeParameters(parameters: tempParametersConstant).data(using: .utf8, allowLossyConversion: true)
          
          //request.httpBody = try! JSONSerialization.data(withJSONObject: bParameters, options: [])
          
        } else {
          
          // Задаём особенности отправки данных. Отправка данных в формате JSON.
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.httpBody = collectJSONData(parameters: tempParametersConstant)
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
      request.setValue("Bearer \(UserToken.instance.token)", forHTTPHeaderField: "Authorization")
    }
    
    return request
  }
  
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
        
        // TODO: расписать - что здесь, собственно, происходит
        api.decreaseNetworkActivityCounter()
        
        // Если мы получили какие-либо данные после запроса к серверу, оборачиваем их в константу
        if let responseData = data {
          
          // TODO: без некой проверки
          if withoutProcessing {
            
            // TODO: comment
            if let json = api.parseJSON(data: responseData) as? JsonDictionary {
              completion(json)
            }
            
            // TODO: с некой таинственной проверкой 
          } else {
            
            let processed = api.processJsonDictionary(data: responseData)
            
            // Если имеем ошибку, вместо готовго JSON
            if let processedError = processed.0 {
              magic(processedError)
              
              // В противном случае...  
            } else if let json = processed.1 {
              magic(json)
              // ... отдаём наш итоговый json в убегающее замыкание
              completion(json)
            }
          }
        }
      })
    }
    
    app.mainQueue.addOperation({
      api.increaseNetworkActivityCounter()
    })
    
    // Запуск задачи на выполнение
    task.resume()
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

func collectJSONData(parameters: [String: Any]) -> Data? {
  do {
    let data = try JSONSerialization.data(withJSONObject: parameters, options: JSONSerialization.WritingOptions(rawValue: 0))
    return data
  } catch let error as NSError {
    magic(error)
    return nil
  }
}
