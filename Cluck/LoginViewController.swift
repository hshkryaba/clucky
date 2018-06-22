//
//  LoginViewController.swift
//  Cluck
//
//  Created by Наталья Синицына on 31.05.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController {
    
    //Outlets
    @IBOutlet weak var loginRegistrationSegment: UISegmentedControl!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var repeatPassTextField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        repeatPassTextField.isHidden = true
        loginButton.layer.cornerRadius = 5
        
        //Looks for single or multiple taps.
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(LoginViewController.dismissKeyboard))
        
        //Uncomment the line below if you want the tap not not interfere and cancel other interactions.
        //tap.cancelsTouchesInView = false
        
        view.addGestureRecognizer(tap)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }
    

    //Funcs
    
    //Calls this function when the tap is recognized.
    @objc func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    
    
    //IBAction funcs
    
    @IBAction func tapLoginSegment(_ sender: Any) {
        if loginRegistrationSegment.isEnabledForSegment(at: 1) {
            repeatPassTextField.isHidden = false
        }
        if loginRegistrationSegment.selectedSegmentIndex == 0 {
            repeatPassTextField.isHidden = true
        }
        
    }
    
    
    @IBAction func tapEnterButton(_ sender: Any) {
    }
    
    @IBAction func tapForgetPassButton(_ sender: Any) {
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
