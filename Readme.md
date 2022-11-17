
6th project from OpenClassrooms's web dev course.

## Installation

Use "npm install" to install.

Use "node server" to launch.

## Auth Routes

###    Signup

    Hashing of the password & adding the user to the database.

    Method: POST
    URI: /api/auth/signup
    Body: {
        email: string,
        password: string
    }
    Response: {
        message: string
    }


###    Login

    Checks the user indentification informations, sends back the usedId with a token.

    Method: POST
    URI: /api/auth/login
    Body: {
        email: string,
        password: string
    }  
    Response: {
        userId: string,
        token: string
    }


## Sauces Routes

    All sauces routes need an authorization.

###    Get all sauces

    Sends a an array with all the sauces from the database.

    Method: Get
    URI: /api/sauces
    Body: -
    Response: Array of sauces


    Get a specific sauce

    Sends the sauce corresponding to the id.

    Method: Get
    URI: /api/sauces/:id
    Body: -
    Response: A single sauce


###    Posting a sauce

    Add a sauce to the database.

    Method: POST
    URI: /api/sauces
    Body: {
        sauce: string,
        image: file
    }
    Response: {
        message: string
    }

###    Update a sauce

    Update an existing sauce using the given id.
    Ownership is necessary.

    Method: PUT
    URI: /api/sauces/:id
    Body: {
        sauce: string,
        image: file
    }
    Response: {
        message: string
    }

###    Delete a sauce

    Delete an existing sauce using the given id.
    Ownership is necessary.

    Method: DELETE
    URI: /api/sauces/:id
    Body: -
    Response: {
        message: string
    }

###    Like/Dislike a sauce

    Like or dislike an existing sauce using the given id.
    
    The action will depends on the given 'like' parameter:
    -like: -1 => dislike.
    -like: 0 => cancel user's like/dislike.
    -like: 1 => like.

    Method: POST
    URI: /api/sauces/:id/like
    Body: {
        userId: string,
        like: number
    }
    Response: {
        message: string
    }