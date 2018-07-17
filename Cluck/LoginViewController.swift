import UIKit

class LoginViewController: UIViewController {
  
  //Outlets
  @IBOutlet weak var loginRegistrationSegment: UISegmentedControl!
  @IBOutlet weak var emailTextField: UITextField!
  @IBOutlet weak var passwordTextField: UITextField!
  @IBOutlet weak var nameTextField: UITextField!
  @IBOutlet weak var loginButton: UIButton!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
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
      loginButton.setTitle("Зарегистрироваться", for: .normal)
    }
  }
  
  @IBAction func tapEnterButton(_ sender: Any) {
    if nameTextField.isHidden {
      app.api.login(login: emailTextField.text!, password: passwordTextField.text!, completion: {
        print("Completion successful")
        let controller = self.storyboard?.instantiateViewController(withIdentifier: "QuestionListTableViewController") as! QuestionListTableViewController
        self.present(controller, animated:true, completion:nil)
      })
    } else {
      app.api.signup(email: emailTextField.text!, login: nameTextField.text!, password: passwordTextField.text!, completion: {
        print("Completion successful")
        let controller = self.storyboard?.instantiateViewController(withIdentifier: "QuestionListTableViewController") as! QuestionListTableViewController
        self.present(controller, animated:true, completion:nil)
      })
    }
    
    // credentials encoded in base64
    /*let username = emailTextField.text!
     let password = passwordTextField.text!
     
     let Url = String(format: "http://cluck-app.org/api/auth/login")
     guard let serviceUrl = URL(string: Url) else { return }
     //        let loginParams = String(format: LOGIN_PARAMETERS1, "test", "Hi World")
     let parameterDictionary = ["login" : username, "password" : password]
     var request = URLRequest(url: serviceUrl)
     request.httpMethod = "POST"
     request.setValue("Application/json", forHTTPHeaderField: "Content-Type")
     guard let httpBody = try? JSONSerialization.data(withJSONObject: parameterDictionary, options: []) else {
     return
     }
     request.httpBody = httpBody
     
     let session = URLSession.shared
     session.dataTask(with: request) { (data, response, error) in
     if let response = response {
     print(response)
     }
     if let data = data {
     do {
     let json = try JSONSerialization.jsonObject(with: data, options: [])
     print(json)
     }catch {
     print(error)
     }
     }
     }.resume()*/
    
  }
  
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
