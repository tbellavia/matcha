UserLogin :
    - POST      /api/user/signup
        - Body 
        {
            usermail: string(20)
            passWord: string(20)
        }
    - POST      /api/user/login
        - Body 
        {
            usermail: string(20)
            passWord: string(20)
        }
    - DELETE    /api/user/:id

UserProfile :
    - GET       /api/user/profile/me
    - GET       /api/user/profile/:target
    - GET       /api/user/profile?limit=<int>
    - POST      /api/user/profile/me
        - Body 
        {
            first_name: string(100)
            last_name:  string(100)
            birthdate:  str
            genre:      str => "homme", "femme", ...
            preference: [string] => ["homme", "femme"]
            biograpy:   string(500)
            tags:       [string] => ["beer", "baseball", ...]
            latitude:   float
            longitude:  float
            photos:     [Blob]
            usermail:   string(20)
            passWord:   string(20)
        }
    - PUT         /api/user/profile/me
        - Body 
        {
            first_name: string(100)
            last_name:  string(100)
            birthdate:  str
            genre:      string => "homme", "femme"
            preference: [string] => ["homme", "femme"]
            biograpy:   string(500)
            tags:       [string] => ["beer", "baseball", ...]
            latitude:   float
            longitude:  float
            photos:     [Blob]
            usermail:   string(20)
            passWord:   string(20)
        }
    - DELETE    /api/user/profile/me
    - DELETE    /api/user/profile/:id


LikeTable :
    - POST      /api/user/like/me/:target
    - POST      /api/user/unlike/me/:target

Blocked :
    - POST      /api/user/blocked/me/:target
    - GET       /api/user/blocked/me?limit=<int>&skip=<int>

Chat :
    - POST      /api/user/chat/me/:target
    - DELETE    /api/user/chat/me/:target
    - GET       /api/user/chat/me/:target?limit=<int>&skip=<int>
    - GET       /api/user/chat/me

Message :
    - POST      /api/user/chat/message/me/:target
        - Body 
        {
            message:    TEXT
        }

Filtre :
    - PUT       /api/user/filtre/me
        - Body
        {
            ageMin:     INT
            ageMax:     INT
            distMax:    INT
            preference: INT
        }
