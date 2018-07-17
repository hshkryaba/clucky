//
//  SideMenuTableViewController.swift
//  Cluck
//
//  Created by Наталья Синицына on 01.06.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit

class SideMenuTableViewController: UITableViewController {
  
  let menuArray = ["Лента вопросов", "Мои вопросы", "Мои ответы", "Таблица лидеров", "Настройки", "Выход"]
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Uncomment the following line to preserve selection between presentations
    // self.clearsSelectionOnViewWillAppear = false
    
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
  // MARK: - Table view data source
  
  override func numberOfSections(in tableView: UITableView) -> Int {
    return 1
  }
  
  override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return 7
  }
  
  override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    /*let cell = tableView.dequeueReusableCell(withIdentifier: "sideMenuCell2", for: indexPath)
     if indexPath.row > 0 {
     cell.textLabel?.text = menuArray[indexPath.row-1]
     }
     
     if indexPath.row%2 != 0 {
     cell.backgroundColor = UIColor(red: 43, green: 99, blue: 114, alpha: 1)
     }*/
    if indexPath.row == 0 {
      let cell = tableView.dequeueReusableCell(withIdentifier: "sideMenuCell", for: indexPath) as! SideMenuTableViewCell
      return cell
    } else {
      let cell = tableView.dequeueReusableCell(withIdentifier: "sideMenuCell2", for: indexPath)
      cell.textLabel?.text = menuArray[indexPath.row-1]
      cell.textLabel?.textColor = .white
      cell.textLabel?.font = UIFont.boldSystemFont(ofSize: 17.0)
      if indexPath.row%2 != 0 {
        cell.backgroundColor = UIColor(red: 43.0/255, green: 99.0/255, blue: 114.0/255, alpha: 1)
      } 
      return cell
    }
    
    
    
    //return cell
  }
  
  override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    if indexPath.row == 0 {
      return 185
    } else {
      return 60
    }
  }
  
  override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    let numberOfRow = indexPath.row
    switch numberOfRow {
    case 1:
      let controller = self.storyboard?.instantiateViewController(withIdentifier: "QuestionListTableViewController") as! QuestionListTableViewController
      self.present(controller, animated:true, completion:nil)
      break
    case 2:
      let controller = self.storyboard?.instantiateViewController(withIdentifier: "MyQuestionsTableViewController") as! MyQuestionsTableViewController
      self.present(controller, animated:true, completion:nil)
      break
    case 6:
      let controller = self.storyboard?.instantiateViewController(withIdentifier: "LoginViewController") as! LoginViewController
      //self.navigationController?.pushViewController(controller, animated: true)
      self.present(controller, animated:true, completion:nil)
      break
    default:
      break
    }
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
