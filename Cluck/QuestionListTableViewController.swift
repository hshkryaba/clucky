//
//  QuestionListTableViewController.swift
//  Cluck
//
//  Created by Наталья Синицына on 31.05.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit
import Magic

class QuestionListTableViewController: UITableViewController {
    
    @IBOutlet weak var filterButton: UIButton!
    @IBOutlet weak var menuIconButton: UIButton!
    
    //vars
    let questionTitles = ["Медицина", "Продукты", "Отношения", "Право", "Образование", "Спорт"]
    let imagesArray = [UIImage(named: "nature1.jpg")!, UIImage(named: "nature2.jpeg")!, UIImage(named: "nature3.jpeg")!, UIImage(named: "nature4.jpeg")!, UIImage(named: "nature5.jpeg")!, UIImage(named: "nature6.jpeg")!]
    
    var questions = [Question]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        app.api.loadUserInfo(id: 6, completion: {
            magic("User info loaded")
        })
        

        filterButton.layer.cornerRadius = 5
        
        let origImage = UIImage(named: "menuIcon")
        let tintedImage = origImage?.withRenderingMode(.alwaysTemplate)
        menuIconButton.setImage(tintedImage, for: .normal)
        menuIconButton.tintColor = .gray
        self.tableView.rowHeight = 140
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    override func viewWillAppear(_ animated: Bool) {
        app.api.loadQuestionList(completion: { (questions) in
            //magic("QL loaded")
            self.questions = questions
        })
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return questions.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "questionListCell", for: indexPath) as! QuestionListTableViewCell
        
        let question = questions[indexPath.row]

        cell.questionTitleLabel.text = question.subject
        cell.questionPreviewLabel.text = question.question
        cell.questionImage.image = imagesArray[0]

        return cell
    }
    

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
