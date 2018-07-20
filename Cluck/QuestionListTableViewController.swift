import UIKit
import Magic

class QuestionListTableViewController: UITableViewController {
  
  @IBOutlet weak var filterButton: UIButton!
  @IBOutlet weak var menuIconButton: UIButton!
  
  let questionTitles  = ["Медицина", "Продукты", "Отношения", "Право", "Образование", "Спорт"]
  let imagesArray     = [UIImage(named: "nature1.jpg")!, UIImage(named: "nature2.jpeg")!, UIImage(named: "nature3.jpeg")!, UIImage(named: "nature4.jpeg")!, UIImage(named: "nature5.jpeg")!, UIImage(named: "nature6.jpeg")!]
  
  var questions = [Question]()
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    app.api.loadUserInfo(id: 6, completion: {
      magic("User info loaded")
    })
    
    filterButton.layer.cornerRadius = 5
    
    let origImage             = UIImage(named: "menuIcon")
    let tintedImage           = origImage?.withRenderingMode(.alwaysTemplate)
    menuIconButton.setImage(tintedImage, for: .normal)
    menuIconButton.tintColor  = .gray
    self.tableView.rowHeight  = 140
  }
  
  override func viewWillAppear(_ animated: Bool) {
    app.api.loadQuestionList(completion: { (questions) in
      //magic("QL loaded")
      self.questions = questions
    })
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
  
}
