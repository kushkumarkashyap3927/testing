

user flow api routes 




1. signup : post method
 
api route : http://localhost:8000/api/v1/user/signup

header : content-type : application/json

request : 

{    "email" : "kush@gmail.com",
    "fullName" : "kush kumar",
    "desc" : "he is a ceo currently",
    "role" : "Ceo",
    "password" : "1234"
}


response :

{
    "statusCode": 200,
    "data": {
        "user": {
            "email": "kush@gmail.com",
            "fullName": "kush kumar",
            "desc": "he is a ceo currently",
            "role": "Ceo",
            "_id": "6995816f092b0a437d036534",
            "createdAt": "2026-02-18T09:07:59.217Z",
            "updatedAt": "2026-02-18T09:07:59.217Z",
            "__v": 0
        }
    },
    "message": "User created in successfully",
    "success": true
}




login : post method

http://localhost:8000/api/v1/user/login


request : 

{    "email" : "kush@gmail.com",
    "fullName" : "kush kumar",
    "desc" : "he is a ceo currently",
    "role" : "Ceo",
    "password" : "1234"
}


response :

{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "699580ba90c4d57010832164",
            "email": "kush@gmail.com",
            "fullName": "kush kumar",
            "createdAt": "2026-02-18T09:04:58.474Z",
            "updatedAt": "2026-02-18T09:04:58.474Z",
            "__v": 0
        }
    },
    "message": "Loggedin successfully",
    "success": true
}




get profile : get method

http://localhost:8000/api/v1/user/profile


request :

 {    "email" : "kush@gmail.com"
}


response :

{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "699583d26eafef011fffeecc",
            "email": "kush@gmail.com",
            "fullName": "kush kumar",
            "desc": "he is a ceo currently",
            "role": "Ceo",
            "createdAt": "2026-02-18T09:18:10.105Z",
            "updatedAt": "2026-02-18T09:18:10.105Z",
            "__v": 0
        }
    },
    "message": "User profile fetched successfully",
    "success": true
}



delete user :  delete method 

http://localhost:8000/api/v1/user/delete

request : 
{    
    "email" : "kush@gmail.com"
}


response :

{
    "statusCode": 200,
    "data": null,
    "message": "User deleted successfully",
    "success": true
}



get all user : get method 

http://localhost:8000/api/v1/user/all

response : 

{
    "statusCode": 200,
    "data": {
        "users": []    
    },
    "message": "Users fetched successfully",
    "success": true
}




