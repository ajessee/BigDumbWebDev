![BigDumbWebDev](https://github.com/ajessee/BigDumbWebDev/blob/master/app/assets/images/BDWD_email_icon.png)

# [BigDumbWebDev](https://www.bigdumbweb.dev/) 

Welcome to Big Dumb Web Dev, a site by and for new web developers. My name is Andre, and I built this site to document my journey into learning about web development, software engineering, and technology. It's been a challenge for me - none of this stuff has come easy, and the only way I've been able to learn is by building things like this.

My hope is that this site can serve as a resource for others who are embarking on a similar journey. There is no way I would have been able to do this on my own; I've been helped by countless people along the way. Now it's my turn to try make a contribution. By sharing my projects and trying to explain them, I hope I can show other people that they are capable of doing the same thing.

The app is written in Rails 6 and currently deployed in production using Heroku. 

## Features:

* Mobile-first design.
* Written in vanilla Javascript and CSS, with a focus on minimizing dependencies and frameworks for my own learning
* Portfolio of all my projects, including other web applications I've built, GitHub repositories of command line applications, features I've built professionally, and automation scripts
* Full featured blog that supports editing with rich text content, images and videos. Full comment feature with rich text content and nested comments
* Custom built auto-save feature for blog which saves user changes in local storage to prevent data loss during blog writing/editing session
* Custom-built modal system
* Custom-built user notification system
* Custom-built menu navigation system
* Custom-built SVG nested comment linking feature to draw lines between replies to comments
* Animated SVG on landing page
* Portfolio project feature which allows users to scroll in 3D through featured projects and shift their perspective in space
* Tag cloud which shows most used tags
* Pagination for blog pages
* Custom-built add-on for Trix editor for code formatting and highlighting using the Prism library
* HTTPS secure connection to protect sensitive user data
* Secure user sign-in with administrative panel to manage users and stories
* User activation email upon user sign-up to ensure that user owns email address
* Automatic password reset feature via email


## Technical Specifications:

* Written in Rails 6
* Hosted on Heroku
* Uses Heroku SendGrid to deliver send user activation emails, password reset emails, or any other communication
* Uses Heroku Postgres and PostgresQL database for data persistence to store user information
* Uses AWS Simple Storage Service (S3) to store web application assets
* Uses Google Analytics to monitor and analyze traffic, bounce rates, and page views
