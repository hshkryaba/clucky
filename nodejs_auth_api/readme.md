Используемые заголовки:

-- заголовки в запросе
Authorization: Bearer <JWT>
content-type: application/json; charset=utf-8

-- заголовки в ответе
content-type: application/json; charset=utf-8

Коды ответов:
-- для всех типов запросов;

401 - не авторизован
404 - данные не найдены
400 - плохой запрос (неправильный формат данных, преданны не все данные и т.п.)
500 - внутренняя ошибка сервера (если произошло исключение или ошибка

-- GET
200 - запрос выполнен успешно (возвращается json данные)

-- POST
201 - ресурс создан успешно
-- PUT
200 - запрос выполнена успешно

-- DELETE
200 - запрос выполнена успешно

Все ответы возвращаются в объекте: 

{
    status: http статус, дублирует статус указанный в заголовке ответа.
    message: описание операции
    result: массив запрошенных объектов или null
    error: {
       code: код ошибки
       message: сообщение ошибки
    } или null
}


-- API.auth
POST /api/auth/login - возвращает JWT, 
принимает {
  "login":"имя или email пользователя", (обязательный) 
  "password":"пароль пользователя" (обязательный)
}
POST /api/auth/logout
не принимает параметры, ожидает access_token
POST /api/auth/refresh
не принимает параметры, ожидает refresh_token
POST /api/auth/register
принимает {
  "login": "имя пользователя", (обязательный) 
  "password": "пароль пользователя" (обязательный)
  "email": "email пользователя" (обязательный)
}

-- API.answers, ожидает access_token 
GET /api/answers
GET /api/answers/:id
GET /api/answers/:id/question
GET /api/ansver/:id/votes
GET /api/answers/:id/user
POST /api/answers
принимает { 
  "answer":"ответ на вопрос", (обязательный) 
  "user_id": "ид пользователя", (не обязателен, извлекается из JWT если не указан)
  "question_id": "ид вопроса"
}
PUT /api/answers/:id
DELETE /api/answers/:id

-- API.categories, ожидает access_token
GET /api/categories
GET /api/categories/:id
GET /api/categories/:id/questions
GET /api/categories/:id/answers
POST /api/categories
принимает {"name":"название категории"} (обязательный)
PUT /api/categories/:id
DELETE /api/categories/:id

-- API.questions, ожидает access_token
GET /api/questions
GET /api/questions/:id
GET /api/questions/:id/answers
GET /api/questions/:id/tags
GET /api/questions/:id/votes
GET /api/questions/:id/category
GET /api/questions/:id/user
POST /api/questions
принимает {
  "subject": "тема вопроса", (обязательный)
  "question":"ответ на вопрос", (обязательный) 
  "user_id": "ид пользователя", (не обязателен, извлекается из JWT если не указан
}

PUT /api/questions/:id
DELETE /api/questions/:id

-- API.question_votes -- ??? в разработке
POST /api/question_votes
PUT /api/question_votes/:question_id/:user_id
DELETE /api/question_votes/:question_id/:user_id

-- API.tags, ожидает access_token
GET /api/tags
GET /api/tags/:id
GET /api/tags/:id/questions
POST /api/tags
принимает {"name":"название тэга"}
PUT /api/tags/:id
DELETE /api/tags/:id

-- API.users, ожидает access_token
GET /api/users
GET /api/users/:id
GET /api/users/:id/answers
GET /api/users/:id/questions
POST /api/users
принимает { 
  "answer":"ответ на вопрос", (обязательный) 
  "user_id": "ид пользователя", (не обязателен, извлекается из JWT если не указан)
  "question_id": "ид вопроса"
}
PUT /api/users/:id
DELETE /api/users/:id
