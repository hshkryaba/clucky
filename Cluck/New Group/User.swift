//
//  User.swift
//  Cluck
//
//  Created by Наталья Синицына on 16.06.2018.
//  Copyright © 2018 Наталья Синицына. All rights reserved.
//

import Foundation

class User: NSObject {
    
    var mEmailAddress: String?
    var mEmailConfirmed: NSNumber?
    var mLastName: String?
    var mName: String?
    
        
        class var current: User {
            let ud = UserDefaults.standard.string(forKey: "user")
            var result: User
            
            do {
                if ud == nil {
                    app.api.createInitUser()
                }
                result = User()
            } catch let error as NSError {
                //app.log(error: error)
                abort()
            }
            
            return result
            
        }
        
    
        var emailAddress: String {
            get {
                var result = ""
                if let binding = mEmailAddress {
                    result = binding
                }
                return result
            }
            
            set {
                mEmailAddress = newValue
            }
        }
        
        var emailAddressConfirmed: Bool {
            get {
                var result = false
                if let binding = mEmailConfirmed?.boolValue {
                    result = binding
                }
                return result
            }
            
            set {
                mEmailConfirmed = NSNumber(value: newValue)
            }
        }
        
        var lastName: String {
            get {
                var result = ""
                if let binding = mLastName {
                    result = binding
                }
                return result
            }
            
            set {
                mLastName = newValue
            }
        }
        
        var name: String {
            get {
                var result = ""
                if let binding = mName {
                    result = binding
                }
                return result
            }
            
            set {
                mName = newValue
            }
        }
    
    var stars: Int = 0
    var id: Int?
    var login = ""
    //var avatar = #imageLiteral(resourceName: "user")
    
    
}
