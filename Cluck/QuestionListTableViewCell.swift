import UIKit

class QuestionListTableViewCell: UITableViewCell {
  
  @IBOutlet weak var questionTitleLabel: UILabel!
  @IBOutlet weak var questionImage: UIImageView!
  @IBOutlet weak var questionPreviewLabel: UILabel!
  @IBOutlet weak var questionAuthorLabel: UILabel!
  @IBOutlet weak var answerButton: UIButton!
  
  override func awakeFromNib() {
    super.awakeFromNib()
    questionAuthorLabel.text = " Алёнушка"
    questionAuthorLabel.addImageWith(name: "user", behindText: false, width: 14, height: 14)
    answerButton.titleLabel?.text = " ОТВЕТИТЬ"
    answerButton.titleLabel?.addImageWith(name: "anchor", behindText: false, width: 15, height: 15)
  }
  
  override func setSelected(_ selected: Bool, animated: Bool) {
    super.setSelected(selected, animated: animated)
    
    // Configure the view for the selected state
  }
  
}
