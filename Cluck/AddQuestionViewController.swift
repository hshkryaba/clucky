//
//  AddQuestionViewController.swift
//  Cluck
//
//  Created by Наталья Синицына on 02.06.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit

class AddQuestionViewController: UIViewController {
    
    @IBOutlet weak var menuButton: UIButton!
    @IBOutlet weak var askQuestionButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let origImage = UIImage(named: "menuIcon")
        let tintedImage = origImage?.withRenderingMode(.alwaysTemplate)
        menuButton.setImage(tintedImage, for: .normal)
        menuButton.tintColor = .gray
        askQuestionButton.layer.cornerRadius = 5
        //Looks for single or multiple taps.
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(AddQuestionViewController.dismissKeyboard))
        
        view.addGestureRecognizer(tap)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func back() {
        dismiss(animated: true, completion: nil)
    }

    //Calls this function when the tap is recognized.
    @objc func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
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
