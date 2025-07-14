# How to run

To run locally you would need to change DATABASES = {'HOST': os.getenv('DB_HOST', 'db')} in the settings.py file of the api folder so that it says 'localhost' instead of 'db'.
To run the backend API, in ArtMediaAPI directory type command: python manage.py runserver
To run the frontend in ArtMediaSite directory type the command: ng serve
To then view the site go to:
  http://localhost:4200/posts

Alternatively to run via docker, in the ArtMediaApp directory type the command: docker compose up --build

# About the app

This is a social media app, specifically targeted towards art and animation.
I wanted to make a full stack app with Django and Angular so I made this social media app.

Users can view posts as well as any likes or comments they have and use the search bar to look for specific posts. Users can also click onto user accounts to view details about the user or view posts that user has made.
Users can create an account or log in to an existing account, logging in allows users to add their own posts or comments which they can edit or delete, also while logged in they will be able to like posts or unlike posts.
Users can click onto their account and add a profile picture or bio as well as edit their details.

Posts include a id, title, text, file, user id that liked it and the user id that made the post.
Comments include text, the post id and user id that made the comment.
Likes include the post id and user id they are associated with.
Users can include a username, email, password, profile picture and biography section.

The site is keyboard compatible meaning it does require a mouse to be used.

Potential future features to add:
Split Posts page into a Home page and a Posts page.
Add option to change text size or colour of site like a night and day mode.
