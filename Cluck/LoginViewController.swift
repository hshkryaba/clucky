import UIKit
import Magic

class LoginViewController: UIViewController {
  
  //Outlets
  @IBOutlet weak var loginRegistrationSegment: UISegmentedControl!
  @IBOutlet weak var emailTextField: UITextField!
  @IBOutlet weak var passwordTextField: UITextField!
  @IBOutlet weak var nameTextField: UITextField!
  @IBOutlet weak var loginButton: UIButton!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Temp
    emailTextField.text     = "info@info.com"
    passwordTextField.text  = "123456"
    
    nameTextField.isHidden = true
    loginButton.layer.cornerRadius = 5
    //passwordTextField.isSecureTextEntry = true - done through main storyboard
    
    //Looks for single or multiple taps.
    let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(LoginViewController.dismissKeyboard))
    
    //Uncomment the line below if you want the tap not not interfere and cancel other interactions.
    //tap.cancelsTouchesInView = false
    
    view.addGestureRecognizer(tap)
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    
  }
  
  // MARK: Functions
  
  //Calls this function when the tap is recognized.
  @objc func dismissKeyboard() {
    //Causes the view (or one of its embedded text fields) to resign the first responder status.
    view.endEditing(true)
  }
  
  // MARK: IBAction functions
  
  /// Нажатие на сегмент выбора "Вход/Регистрация"
  @IBAction func tapLoginSegment(_ sender: Any) {
    if loginRegistrationSegment.selectedSegmentIndex == 0 {
      nameTextField.isHidden.toggle()
      loginButton.setTitle("Войти", for: .normal)
    }
    if loginRegistrationSegment.selectedSegmentIndex == 1 {
      nameTextField.isHidden.toggle()
      loginButton.setTitle("Зарегистрироваться", for: .normal)
    }
  }
  
  // Процесс Авторизации/Регистрации при нажатии на кнопку Войти/Зарегистрироваться
  @IBAction func tapEnterButton(_ sender: Any) {

    // Обозначение контролёра, к которому будет совершён переход по окончании автоизационного замыкания
    let controller = self.storyboard?.instantiateViewController(withIdentifier: "QuestionListTableViewController") as! QuestionListTableViewController

    if nameTextField.isHidden {
      // Авторизация
      app.api.login(username: emailTextField.text!, password: passwordTextField.text!, completion: {
        magic("Completion successful")
        
        // Процесс перехода на указанный выше контролёр
        self.present(controller, animated:true, completion:nil)
      })

    } else {
      // Регистрация
      app.api.signup(email: emailTextField.text!, login: nameTextField.text!, password: passwordTextField.text!, completion: {
        magic("Registration successful")
        
        // Процесс перехода на указанный выше контролёр
        self.present(controller, animated: true, completion: nil)
      })
    }
    
    // TODO: credentials encoded in base64
//    let username = emailTextField.text!
//    let password = passwordTextField.text!
//    
//    let Url = String(format: "http://cluck-app.org/api/auth/login")
//    guard let serviceUrl = URL(string: Url) else { return }
//    
//    // let loginParams = String(format: LOGIN_PARAMETERS1, "test", "Hi World")
//    
//    let parameterDictionary = ["login" : username, "password" : password]
//    var request = URLRequest(url: serviceUrl)
//    request.httpMethod = "POST"
//    request.setValue("Application/json", forHTTPHeaderField: "Content-Type")
//    guard let httpBody = try? JSONSerialization.data(withJSONObject: parameterDictionary, options: []) else {
//      return
//    }
//    request.httpBody = httpBody
//    
//    let session = URLSession.shared
//    session.dataTask(with: request) { (data, response, error) in
//      if let response = response {
//        magic(response)
//      }
//      if let data = data {
//        do {
//          let json = try JSONSerialization.jsonObject(with: data, options: [])
//          magic(json)
//        }catch {
//          magic(error)
//        }
//      }
//      }.resume()
  }
  
  /// Забыл пароль, друг?
  @IBAction func tapForgetPassButton(_ sender: Any) {}
  
  /*
   // MARK: - Navigation
   
   // In a storyboard-based application, you will often want to do a little preparation before navigation
   override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
   // Get the new view controller using segue.destinationViewController.
   // Pass the selected object to the new view controller.
   }
   */
  
}
