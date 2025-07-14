# How to run

The easiest way to run this app is via docker, assuming you have docker installed: in the ArtMediaApp directory type the command: docker compose up --build

To run locally you would need to change DATABASES = {'HOST': os.getenv('DB_HOST', 'db')} in the settings.py file of the api folder so that it says 'localhost' instead of 'db'.
To run the backend API, in ArtMediaAPI directory type command: python manage.py runserver
To run the frontend in ArtMediaSite directory type the command: ng serve
To then view the site go to:
  http://localhost:4200/posts

To populate the database I have a datadump.json file with sample data in the api folder.
You can run a command such as python manage.py migrate && python manage.py loaddata datadump.json

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

# Screenshots of the site

<img width="946" height="587" alt="Art Share Full Home Title" src="https://github.com/user-attachments/assets/3d889940-699c-498f-bc98-f20cc92991cd" />
<img width="960" height="440" alt="Art Share Home" src="https://github.com/user-attachments/assets/27fd15c5-daf9-43c4-a14b-957b711a1926" />
<img width="960" height="446" alt="Art Share My Post Page" src="https://github.com/user-attachments/assets/33f223fe-60ca-4b98-a3bf-d83af137b51e" />
<img width="960" height="443" alt="Art Share Logged Out Post Page" src="https://github.com/user-attachments/assets/2112e0b1-2927-4f4a-afe0-dedfb2268c93" />
<img width="947" height="445" alt="Art Share Post" src="https://github.com/user-attachments/assets/ddc62136-b807-4f0d-b44c-90adc64aa5c1" />
<img width="959" height="444" alt="Art Share My Account Page" src="https://github.com/user-attachments/assets/56d142d0-0a34-47da-993a-b406a5d98b7b" />
<img width="707" height="240" alt="Art Share Search Posts Page" src="https://github.com/user-attachments/assets/43fe394b-4d65-4ce5-a48c-f50bd1c606f7" />


