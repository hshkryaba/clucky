//
//  MyQuestionsTableViewCell.swift
//  Cluck
//
//  Created by Наталья Синицына on 28.06.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import UIKit

class MyQuestionsTableViewCell: UITableViewCell {

    @IBOutlet weak var categoryImage: UIImageView!
    @IBOutlet weak var questionLabel: UILabel!
    @IBOutlet weak var categoryLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
