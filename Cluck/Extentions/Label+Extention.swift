import Foundation
import UIKit

extension UILabel {
  
  func addImageWith(name: String, behindText: Bool, width: Int, height: Int) {
    
    let attachment = NSTextAttachment()
    attachment.image = UIImage(named: name)
    attachment.bounds = CGRect(x: 0, y: 0, width: width, height: height)
    let attachmentString = NSAttributedString(attachment: attachment)
    
    guard let txt = self.text else {
      return
    }
    
    if behindText {
      let strLabelText = NSMutableAttributedString(string: txt)
      strLabelText.append(attachmentString)
      self.attributedText = strLabelText
    } else {
      let strLabelText = NSAttributedString(string: txt)
      let mutableAttachmentString = NSMutableAttributedString(attributedString: attachmentString)
      mutableAttachmentString.append(strLabelText)
      self.attributedText = mutableAttachmentString
    }
  }
  
  func removeImage() {
    let text = self.text
    self.attributedText = nil
    self.text = text
  }
}
