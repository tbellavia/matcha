# Front
- Auth :
    - Add protected routes
    - Store jwt in HTTP-Only cookie

- Pages :
    - Profile Page :
        - Create generic profile page
        - Add profile pages for :
            - Me
            - Other
        - Add react route loader to fetch data

    - Create Profile Page :
        - Add modify profile page based on CreateProfile page

    - Modals :
        - Settings :
            - Reset email
            - Reset password

    - Feed :
        - Create feed layout    

    - Login / Signup
        - Fix form size

- Components :
    - Header display on mobile

# Back
- Send JWT in HTTP-Only cookie
- Add reset mechanism :
    - Add reset email
    - Add reset password




# Notes

{
    me: <bool>,
    first_name: <string>.
    last_name: <string>,
    age: <int>,

    submitAction: <Component/>,
    cancelAction: <Component/>,
}


# Generic Profile Page

Page generique quand requete faite sur la route : `/profile/id`

## Already Answered
Pas de boutons.

```json
{
    "type": "alreadyAnswered",
    "result": {
        "id": 4,
        "first_name": "test4",
        "last_name": "test4",
        "birth": "1999-08-15T00:00:00.000Z",
        "genre": 2,
        "preference": 3,
        "biography": "salut",
        "tags": [
            "beer",
            "football",
            "healthy",
            "foot"
        ],
        "latitude": 48.811170795677846,
        "longitude": 2.3769349897460845,
        "rating": "0.33333333333333333333",
        "photo1": null,
        "photo2": null,
        "photo3": null,
        "photo4": null,
        "photo5": null,
        "agemin": 18,
        "agemax": 150,
        "distmax": 1000,
        "minrating": null,
        "tri": null,
        "filtertags": "beer,football,healthy,foot",
        "age": 23.802739726027397,
        "distance": 14.85257033343496
    },
    "me": {
        "photo": null,
        "first_name": "test5",
        "last_name": "test5"
    }
}
```

## Match
Afficher bouton supprimer ou bloquer.

```json
{
    "type": "match",
    "result": {},
    "me": {}
}
```

## Blocked
Ne pas afficher de boutons ni de profile.

```json
{
    "type": "blocked",
    "result": []
}
```

## Me
Afficher bouton de modification ou de supression.

```json
{
    "type": "me",
    "result": {}
}
```

