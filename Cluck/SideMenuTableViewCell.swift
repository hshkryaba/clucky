//
//  SideMenuTableViewCell.swift
//  Cluck
//
//  Created by Наталья Синицына on 02.06.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit

class SideMenuTableViewCell: UITableViewCell {
    
    @IBOutlet weak var photo: UIImageView!
    @IBOutlet weak var starLabel: UILabel!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var askQuestionButton: UIButton!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        photo.layer.cornerRadius = 50
        photo.layer.borderWidth = 2
        photo.layer.borderColor = UIColor.white.cgColor
        askQuestionButton.layer.cornerRadius = 5
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
