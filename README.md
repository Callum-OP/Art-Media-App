This is a social media app, specifically targeted towards art and animation.

To run the backend API, change into ArtMediaAPI directory and type the command: python manage.py runserver.
To run the frontend change into ArtMediaSite directory and type the command: ng serve.

Users can view posts as well as any likes or comments they have and use the search bar to look for specific posts. Users can also click onto user accounts to view details about the user or view posts that user has made.
Users can create an account or log in to an existing account, logging in allows users to add their own posts or comments which they can edit or delete, also while logged in they will be able to like posts or unlike posts.
Users can click onto their account and add a profile picture or bio as well as edit their details.

Posts include a id, title, text, file, user id that liked it and the user id that made the post.
Comments include text, the post id and user id that made the comment.
Likes include the post id and user id they are associated with.
Users can include a username, email, password, profile picture and biography section.

Features to add:
View liked posts
Follow users and view followed users

Potential features to add:
Split Posts page into a Home page and a Posts page
Accessiblity features such as: 
    Options to change text size or colour of site like a night and day mode
    Be able to use the site using only a keyboard; currently tab can be used navigate between links, buttons and form options but not all buttons work when pressing enter and the profile picture on nav bar does not highlight to show it is selected


Currently unresolved bugs:
Switching to your own user account page while viewing another user account page does not refresh the page