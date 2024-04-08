---
title: "Social Media App using MERN - Client"
description: "In this post we will handle the client side of the application with React, Redux and Bootstrap. "
category: ["react", "frontend", "redux", "bootstrap"]
pubDate: "2023-12-05"
published: true
---

This is the link of the [project](https://github.com/Radinax/mern-social-network) we will be using to learn about this stack.

MERN stack is:

> MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas

> Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.

> React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications

> Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

This is one of the most popular stacks out there, we will use this to create this Social Media App.

Here is the [link of the project completed](https://secret-ocean-02865.herokuapp.com/).

## Folder Structure

```text
└── src
    |── components
    |   |── addCredentials
    |   |   |── AddEducation.js
    |   |   └── AddExperience.js
    |   |── auth
    |   |   |── Login.js
    |   |   └──Register.js
    |   |── common
    |   |   |── InputGroup.js
    |   |   |── PrivateRoute.js
    |   |   |── SelectListGroup.js
    |   |   |── Spinner.gif
    |   |   |── Spinner.js
    |   |   |── TextAreaFieldGroup.js
    |   |   └── TextFieldGroup.js
    |   |── createProfile
    |   |   └── CreateProfile.js
    |   |── dashboard
    |   |   |── Dashboard.js
    |   |   |── Education.js
    |   |   |── Experience.js
    |   |   └── ProfileActions.js
    |   |── editProfile
    |   |   |── EditProfile.js
    |   |   └── utils.js
    |   |── layout
    |   |   |── Footer.js
    |   |   |── Landing.js
    |   |   └── Navbar.js
    |   |── notFound
    |   |   └── NotFound.js
    |   |── posts
    |   |   |── PostFeed.js
    |   |   |── PostForm.js
    |   |   |── PostItem.js
    |   |   └── Posts.js
    |   |── profile
    |   |   |── Profile.js
    |   |   |── ProfileAbout.js
    |   |   |── ProfileCreds.js
    |   |   |── ProfileGithub.js
    |   |   └── ProfileHeader.js
    |   └── profiles
    |       |── ProfileItem.js
    |       └── Profiles.js
    ├── ducks
    |   |── slices
    |   |   |── loginSlice.js
    |   |   |── postSlice.js
    |   |   |── profileSlice.js
    |   |   └── registerSlice.js
    |   └── index.js
    ├── img
    ├── utils
    |   |── isEmpty.js
    |   |── lowerCase.js
    |   └── setAuthToken.js
    ├── App.css
    ├── App.js
    └── index.js
```

## Libraries

- `bootstrap`: Is the UI framework we will be using. Inside App.js we need to import bootstrap.css in order for it to work.
- `@reduxjs/toolkit`: It’s the recommended way of using Redux in 2022. We focus on creating Slices which combines Reducers and Actions, reducing significantly the boilerplate.
- `react-redux`: We will be using Redux to handle state management and update our UI and express server at the same time.
- `axios`: Let us make HTTP requests.
- `classnames`: Let us manipulate `CSS` classes, since we’re using pure Bootstrap we don’t need to write any `CSS` except the one in `App.css` which is to normalize it.
- `http-proxy-middleware`: This is a library that helps us deploy our fullstack application to Heroku, adding another way of telling it that we’re using localhost:5000 as the port to communicate.
- `jwt-decode`: This is needed due to the express server returning the token when we login, so we need to decode it to obtain the information we need, in this case the User login information which will be held inside the Redux state.
- `moment`: Along with react-moment, this library let us handle dates in a more elegant way.

## Thought Process on building the Client

In our server we created the following endpoints:

```text
└── /api/users
              /register                         [POST]
              /login                            [POST]
              /current                          [GET]

└── /api/profile                                [GET] [POST] [DELETE]
              /all                              [GET]
              /handle/:handle                   [GET]
              /user/:user_id                    [GET]
              /experience                       [POST]
              /education                        [POST]
              /experience/:exp_id               [DELETE]
              /education/:edu_id                [DELETE]

└── /api/posts                                  [GET] [POST]
              /:post_id                         [GET] [DELETE]
              /like/:post_id                    [POST]
              /unlike/:post_id                  [POST]
              /comment/:post_id                 [POST]
              /comment/:post_id/:comment_id     [DELETE]
```

There are two routes, a public one where anyone can make a request to the respective endpoint using a program like Postman or making an HTTP request, then we have a private one where we need the user to login.

With those endpoints in mind let’s go with a step by step summary on how we would tackle this application.

## REGISTER

We start by setting up our register component and functionality. For the UI we create a form, where it sends a post request to `/api/users/register` with the user information inside the Redux State, which uses `@reduxjs/toolkit` slices:

```javascript
// src/ducks/slices/registerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Api
export const registerUser = (user, history) => async (dispatch) => {
  axios
    .post("/api/users/register", { ...user })
    .then((res) => {
      history.push("/login");
      dispatch(registerUserSuccess(res));
    })
    .catch((err) => {
      dispatch(registerUserError(err.response.data));
    });
};

// Initial State
const initialState = {
  user: {},
  loading: false,
  error: "",
};

// Slice
export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerUserLoading: (state) => {
      state.loading = true;
    },
    registerUserSuccess: (state, { payload }) => {
      state.user = payload.data;
      state.loading = false;
      state.error = false;
    },
    registerUserError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

// Destructuring the actions we're gonna use in the app
export const { registerUserLoading, registerUserSuccess, registerUserError } =
  registerSlice.actions;

export const userSelector = (state) => state.user;
export const loadingSelector = (state) => state.loading;
export const errorSelector = (state) => state.error;
```

We use Redux Thunk for handling our async actions which we call inside our component and pass it the user information which is send to the endpoint, if we get an error like email not being valid, password too short or not equal to the confirm password field or the name already taken, then it sends an error as response which we catch and put it inside the state, which if it exists will update our UI.

In our server we receive this information and hash the password storing it in the DB.

## LOGIN

Using the information we used to register, we can login inside our application, inside our client we send a post request from the Login component, but first let’s check our Redux Slice for this since it’s quite different:

```javascript
// src/ducks/slices/loginSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { isEmpty } from "../../utils/isEmpty";
import jwt_decode from "jwt-decode";

// API
export const loginUser = (user, history) => async (dispatch) => {
  axios
    .post("/api/users/login", { ...user })
    .then((res) => {
      // Save to localstorage
      const { token } = res.data;
      // Set token to LS
      localStorage.setItem("jwtToken", token);
      // Set token Auth Header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
    })
    .catch((err) => {
      dispatch(loggedUserError(err.response.data));
    });
};

export const logoutUser = (history) => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  if (history) history.push("/");
};

// Initial State
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  error: "",
};

// SLICE
export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.isAuthenticated = !isEmpty(payload);
      state.user = payload;
    },
    loggedUserError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

// ACTIONS
export const { setCurrentUser, loggedUserError } = loginSlice.actions;

// Selectors
export const userSelector = (state) => state.user;
export const loadingSelector = (state) => state.loading;
export const isAuthenticatedSelector = (state) => state.isAuthenticated;
export const errorSelector = (state) => state.error;
```

When we login we take the token we got as a response of the post request and put it inside the `localStorage`, then we use a utility function to add the token to the Authorization Headers for being able to use our private routes. We decode the token which contains the user information and we set it inside our Redux State and we send the user to the Dashboard component.

Inside our server when we send the request to login, we compare the passwords using `bcrypt` (remember the one we register is hashed) and then we use `JWT` to create the token using user information which is send as response.

## Profile

```javascript
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Api
export const getCurrentProfile = () => async (dispatch) => {
  dispatch(loadingHandler());
  axios
    .get("/api/profile")
    .then((res) => {
      dispatch(profileRequestSuccess(res.data));
    })
    // 046 MIN 09:00 WE ARE NOT USING ERRORS
    // WILL CHANGE AFTER
    .catch((err) => {
      dispatch(errorHandler(err.response.data));
    });
};

// Get profile by handle
export const getProfileByHandle = (handle) => async (dispatch) => {
  dispatch(loadingHandler());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then((res) => {
      dispatch(profileRequestSuccess(res.data));
    })
    // 046 MIN 09:00 WE ARE NOT USING ERRORS
    // WILL CHANGE AFTER
    .catch((err) => {
      dispatch(errorHandler(err.response.data));
    });
};

// Get All Profiles
export const getProfiles = () => async (dispatch) => {
  dispatch(loadingHandler());
  axios
    .get("/api/profile/all")
    .then((res) => {
      dispatch(profilesRequestSuccess(res.data));
    })
    .catch((err) => {
      dispatch(errorHandler(err.response.data));
    });
};

// Create Profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch(errorHandler(err.response.data)));
};

// Add Experience
export const addExperience = (experienceData, history) => (dispatch) => {
  axios
    .post("/api/profile/experience", experienceData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch(errorHandler(err.response.data)));
};

// Add Education
export const addEducation = (educationData, history) => (dispatch) => {
  axios
    .post("/api/profile/education", educationData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch(errorHandler(err.response.data)));
};

// Delete Account and Profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone")) {
    axios
      .delete("/api/profile")
      .then((res) => dispatch(deleteAccountSuccess()))
      .catch((err) => {
        errorHandler(err.response.data);
      });
  }
};

// Delete Experience
export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then((res) => dispatch(getCurrentProfile()))
    .catch((err) => {
      errorHandler(err.response.data);
    });
};

// Delete Education
export const deleteEducation = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/education/${id}`)
    .then((res) => dispatch(getCurrentProfile()))
    .catch((err) => {
      errorHandler(err.response.data);
    });
};

// Initial State
const initialState = {
  profile: null,
  profiles: null,
  loading: false,
  error: "",
};

// Slice
export const profileSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    // Invidiual profile
    profileRequestSuccess: (state, { payload }) => {
      state.profile = payload;
      state.loading = false;
    },
    // Multiple profiles
    profilesRequestSuccess: (state, { payload }) => {
      state.profiles = payload;
      state.loading = false;
      state.error = false;
    },
    clearProfile: (state, { payload }) => {
      state.profile = null;
    },
    deleteAccountSuccess: (state) => {
      state.profile = null;
    },
    // Handles the loading state
    loadingHandler: (state) => {
      state.loading = true;
    },
    // Handles all errors
    errorHandler: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

// Destructuring the actions we're gonna use in the app
export const {
  profileRequestSuccess,
  profilesRequestSuccess,
  clearProfile,
  deleteAccountSuccess,
  errorHandler,
  loadingHandler,
} = profileSlice.actions;

// Selectors
export const profileSelector = (state) => state.profile;
export const loadingSelector = (state) => state.loading;
export const profilesSelector = (state) => state.profiles;
export const errorSelector = (state) => state.error;
```

## DASHBOARD

We create a Dashboard component which is the place we’re sending the user after being logged in. We give the option to create a profile if they don’t have one.

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// Components
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import Experience from "./Experience";
import Education from "./Education";
// Redux Actions
import {
  // API
  getCurrentProfile,
  deleteAccount,
  // Selectors
  profileSelector,
  loadingSelector,
  profilesSelector,
  errorSelector,
} from "../../ducks/slices/profileSlice";
import { setCurrentUser, userSelector } from "../../ducks/slices/loginSlice";

const mapDispatchToProps = { getCurrentProfile, setCurrentUser, deleteAccount };
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  loading: state.profile.loading,
  error: state.profile.error,
  login: state.login,
});

const Dashboard = () => {
  const user = useSelector(userSelector);
  const profile = useSelector(profileSelector);
  const loading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner />;

  const handle = profile === null ? "" : profile.handle;
  const experience = profile === null ? "" : profile.experience;
  const education = profile === null ? "" : profile.education;

  const onDeleteClick = (e) => {
    deleteAccount();
    setCurrentUser({});
  };

  const userProfile = (
    <div>
      <p className="lead text-muted">
        Welcome <Link to={`/profile/${handle}`}>{user.name}</Link>
      </p>
      <ProfileActions />
      <Experience data={experience} />
      <Education data={education} />
      <div style={{ marginBottom: "60px" }} />
      <button onClick={onDeleteClick} className="btn btn-danger">
        Delete My Account
      </button>
    </div>
  );

  const requestUserProfile = (
    <div>
      <p className="lead text-muted">Welcome {user.name}</p>
      <p>You have not yet setup a profile, please add some info</p>
      <Link to="/create-profile" className="btn btn-lg btn-info">
        Create Profile
      </Link>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Dashboard</h1>
            {profile === null ? requestUserProfile : userProfile}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

## CREATE, READ, UPDATE AND DELETE PROFILE

If the user doesn’t have a profile we show a message and give them the option to create one.

This step is similar to the register, we created three reusable components in text, textarea and select inputs, we bring the redux async action to send the profile data and if we get an error we show it in the UI, once created we get redirected to the Dashboard.

User can also edit their profile and it will be mapped with the data he alredy has using a getCurrentProfile async action and then sending the information stored from the action and the user inputs.

User can also delete their profile, but **it deletes both the profile and the user**, which is why we need to send a warning message for the user. For delete we only need to send the request and the backend gets the user id and proceed to delete it from the database.

For the next step, any user can check all the profiles.

Let's check an example of CREATE profile:

```javascript
import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
// Redux Action
import {
  createProfile,
  profileSelector,
  errorSelector,
} from "../../ducks/slices/profileSlice";

const CreateProfile = () => {
  const [displaySocialInputs, setDisplaySocialInputs] = useState(false);
  const [handle, setHandle] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [skills, setSkills] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useSelector(profileSelector);
  const error = useSelector(errorSelector);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProfile(
        {
          handle,
          company,
          website,
          location,
          status,
          skills,
          githubUsername,
          bio,
          twitter,
          facebook,
          linkedin,
          youtube,
          instagram,
        },
        history
      )
    );
  };

  const onChange = (setter) => (e) => setter(e.target.value);

  const onClick = () => {
    setDisplaySocialInputs(!displaySocialInputs);
  };

  const socialInputs = (
    <div>
      <InputGroup
        placeholder="Twitter Profile URL"
        name="Twitter"
        icon="fab fa-twitter"
        value={twitter}
        onChange={onChange(setTwitter)}
        error={error.twitter}
      />
      <InputGroup
        placeholder="Facebook Profile URL"
        name="Facebook"
        icon="fab fa-facebook"
        value={facebook}
        onChange={onChange(setFacebook)}
        error={error.facebook}
      />
      <InputGroup
        placeholder="Instagram Profile URL"
        name="Instagram"
        icon="fab fa-instagram"
        value={instagram}
        onChange={onChange(setInstagram)}
        error={error.instagram}
      />
      <InputGroup
        placeholder="Youtube Profile URL"
        onChange={onChange(setYoutube)}
        name="Youtube"
        icon="fab fa-youtube"
        value={youtube}
        error={error.youtube}
      />
      <InputGroup
        placeholder="Linkedin Profile URL"
        onChange={onChange(setLinkedin)}
        name="Linkedin"
        icon="fab fa-linkedin"
        value={linkedin}
        error={error.linkedin}
      />
    </div>
  );

  // Select options for status
  const options = [
    {
      label: "* Select Professional Status",
      value: 0,
    },
    {
      label: "Developer",
      value: "Developer",
    },
    {
      label: "Junior Developer",
      value: "Junior Developer",
    },
    {
      label: "Senior Developer",
      value: "Senior Developer",
    },
    {
      label: "Manager",
      value: "Manager",
    },
    {
      label: "Student or Learning",
      value: "Student or Learning",
    },
    {
      label: "Instructor or Teacher",
      value: "Instructor or Teacher",
    },
    {
      label: "Intern",
      value: "Intern",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  return (
    <div className="create-profile">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Create Your profile</h1>
            <p className="lead text-center">
              Let's get some information to make your profile stand out
            </p>
            <small className="d-block pb-3">* = required fields</small>
            <form onSubmit={onSubmit}>
              <TextFieldGroup
                placeholder="* Profile handle"
                name="handle"
                value={handle}
                onChange={onChange(setHandle)}
                error={error.handle}
                info="A unique handle for your profile URL. You full name, company name, nickname)"
              />
              <SelectListGroup
                placeholder="Status"
                name="status"
                value={status}
                onChange={onChange(setStatus)}
                options={options}
                error={error.status}
                info="Give us an idea where you are at in your career"
              />
              <TextFieldGroup
                placeholder="Company"
                name="company"
                value={company}
                onChange={onChange(setCompany)}
                error={error.company}
                info="Could be your own company or one you work for"
              />
              <TextFieldGroup
                placeholder="Website"
                name="website"
                value={website}
                onChange={onChange(setWebsite)}
                error={error.website}
                info="Could be your own website or a company one"
              />
              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={location}
                onChange={onChange(setLocation)}
                error={error.location}
                info="City or city & state suggested (eg. Boston, MA)"
              />
              <TextFieldGroup
                placeholder="* Skills"
                name="skills"
                value={skills}
                onChange={onChange(setSkills)}
                error={error.skills}
                info="Please use comma separated values (eg. HTML,CSS,Javascript,PHP)"
              />
              <TextFieldGroup
                placeholder="Github Username"
                name="githubUsername"
                value={githubUsername}
                onChange={onChange(setGithubUsername)}
                error={error.githubUsername}
                info="If you want your latest repos and a Github link, include your username"
              />
              <TextAreaFieldGroup
                placeholder="Short Bio"
                name="bio"
                value={bio}
                onChange={onChange(setBio)}
                error={error.bio}
                info="Tell us a little about yourself"
              />

              <div className="mb-3">
                <button onClick={onClick} className="btn btn-light">
                  Add Social Network Links
                </button>
                <span className="text-muted">Optional</span>
              </div>
              {displaySocialInputs && socialInputs}
              <input
                type="submit"
                value="Submit"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
```

As you can see its a bit messy, you should use `react-hook-forms` and do an effective refactor!

The rest of the process is similar.

## EDUCATION AND EXPERIENCE

User can also add their education and experience on separate components and endpoints.

The process is similar, you add data into a form and then send it to the server, then you handle errors if there are any and you get redirected to the dashboard to add another education or experience.

You can also delete them with just one action, for each case you need to send their respective id which is generated in the database.

## FEED, POST, COMMENTS AND LIKES

Now that we explored all that we could in the dashboard section, we’re going into the Feed. The idea is that a user can make a post and like/unlike and comment other posts.

So when a user makes a post it updates the database and the redux state, showing the change in real time, the user can delete its post and like/unlike it if he wants, but only once, otherwise they get an error.

## DEPLOY TO HEROKU

This was very tricky to handle, but let’s go over it step by step:

1. Signup in the Heroku website.
2. Download the Heroku CLI or Toolbelt and install.
3. Open the terminal and write ”**heroku**” to see if it works.
4. To do anything you need to login, ”**heroku login**“.
5. Next do ”**heroku create**”, to create a heroku application.
6. Go inside your dashboard in Heroku and add the keys for database, the **MONGO_URI** and **SECRET\_ OR_KEY**, that’s inside your config files in your server.
7. Go into the deploy section and copy the link where it says “Existing Git Repository”, paste it in your terminal while logged in.
8. Inside your package.json in the root folder of the server, add the following script: **“heroku-postbuild”: “cd client && yarn install && yarn build”**.
9. Next inside your package.json in the **client**, install the “http-proxy-middleware” library, create a file inside src:

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
```

This helps Heroku to connect the client with the server.

Now for the next step, and this is important, in your terminal add the following command “heroku config:set YARN_PRODUCTION=false”, this installs all your dev dependencies and you avoid the “INVALID POST HEADER” errors.

Finally it’s time to deploy! First upload to github all your work and then inside the terminal with heroku logged in, write **git push heroku master** and we’re done!

## Conclusion

The client side was more on the repetitive side, there were a LOT of components created for this social network application we created in a week, the idea was to go into the flow the user would experiment and go from there. For the lessons we learned:

- We got to handle tokens using JWT both in server and client.
- We used @reduxjs/toolkit in a medium sized application which we learned that we could declare a reducer to handle errors and loadings in general.
- We learned to use pure Boostrap without writing any extra CSS code.
- We were able to update both the global state and database providing real time changes in the UI for async actions.
- We were able to handle deployment with Heroku.

This was a great experience filled with plenty of learning!

See you on the next post.

Sincerely,

**Eng. Adrian Beria**
