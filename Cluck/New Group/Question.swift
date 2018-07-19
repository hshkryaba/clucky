//
//  Question.swift
//  Cluck
//
//  Created by Наталья Синицына on 16.07.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import Foundation
import CoreData
import Magic

class Question: NSObject {
    
    var question: String?
    var subject: String?
    var id: Int?
    var views: Int?
    
    //MARK: - INIT
    
    init(json: JsonDictionary) {
        
        self.question = json["question"] as? String
        self.subject = json["subject"] as? String
        self.id = json["id"] as? Int
        self.views = json["views"] as? Int
       
    }
    
    
    /** Сохранить список из json */
    
    class func insertQuestionList(json: JsonDictionary) -> [Question] {
        var result = [Question]()
        if let list = json["result"] as? JsonArray {
            for case let item as JsonDictionary in list {
                let question = Question.init(json: item)
                result.append(question)
            }
        }
        magic(result)
        return result
    }
    
}
