import { Mini, url, type HtmlHandler } from "@spirobel/mininext";
import { createSession, deleteCookie, getSession } from "./sessions";
const MaybeLoggedIn = url.data(async (mini: Mini) => {
  const sessionRow = getSession(mini.req);
  const logoutForm = await logout(mini);
  const loginForm = await login(mini);
  let loggedin = false;
  let headerSetter = mini.html`${loginForm.formInfo?.newHeaders}${logoutForm.formInfo?.newHeaders}`;
  if ((sessionRow?.id && !logoutForm.formInfo) || loginForm.formInfo?.id) {
    loggedin = true;
  }

  return {
    loggedin,
    logoutForm,
    loginForm,
    headerSetter,
  };
});
export type Loggedin = typeof MaybeLoggedIn.$Data;
/**
 * this function wraps a route handler and makes sure the user is logged in.
 * if the user is not logged in there will be an htmlform to log in
 * @param loggedin - an HtmlHandler that is only accessed if the user has a loggedin session
 * @returns a new Htmlhandler that can be installed for a certain url
 */
export function LoginCheck(loggedin: HtmlHandler<Loggedin>) {
  return MaybeLoggedIn.handler(async (mini) => {
    if (mini.data.loggedin) {
      return mini.html`${mini.data.headerSetter}${loggedin}`;
    } else {
      return mini.html`${mini.data.headerSetter} ${mini.data.loginForm.formResponse}`;
    }
  });
}
export function LoginCheckPostJson(loggedin: HtmlHandler<Loggedin>) {
  return url.postJson(
    MaybeLoggedIn.handler((mini) => {
      if (mini.data.loggedin) {
        return mini.json`${loggedin}`;
      } else {
        return mini.json`{"error": "not logged in"}`;
      }
    })
  );
}

const login = url.namedForm("login", (mini: Mini) => {
  const formInfo = mini.form.onPostSubmit(() => {
    if (mini.form.formData) {
      const password = mini.form.formData.get("password");
      if (password === Bun.env.ADMIN_SECRET) {
        const sessionRow = createSession("admin");
        return {
          ...sessionRow,
          newHeaders: mini.html`${mini.headers({
            "Set-Cookie": `sessionId=${sessionRow.cookie}; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure; HttpOnly; SameSite=Strict; path=/`,
          })}`,
        };
      } else {
        return {
          wrongPassword: mini.html`<div style="color:red; display: position: absolute">wrong password</div>`,
        };
      }
    }
  });
  if (formInfo && "newHeaders" in formInfo) {
    return {
      formResponse: mini.html`${formInfo.newHeaders}`,
      formInfo,
    };
  }
  return {
    formResponse: mini.html`<style> ${loggedoutStyles} </style>       
  <form action="${mini.form.actionlink()}" method="POST">
            <input type="password"
                   id="password" 
                   name="password" 
                   placeholder="Enter your Password" required>
                   ${formInfo?.wrongPassword}
                  ${mini.form.hiddenField}
                <button type="submit">
                    enter
                </button>
        </form>`,
  };
});
const logout = url.namedForm("logout", (mini: Mini) => {
  const formInfo = mini.form.onPostSubmit(() => {
    deleteCookie(mini.req);
    return {
      newHeaders: mini.html`${mini.headers({
        "Set-Cookie": `sessionId==deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT Secure; HttpOnly; SameSite=Strict; path=/`,
      })}`,
    };
  });
  if (formInfo) {
    return {
      formResponse: mini.html`${formInfo.newHeaders}`,
      formInfo,
    };
  }
  return {
    formResponse: mini.html`
   <form action="${mini.form.actionlink()}" method="POST">
                  ${mini.form.hiddenField}
                <button type="submit" class="logoutButton">
                    logout
                </button>
        </form>`,
  };
});

export const loggedoutStyles = (mini: Mini) => mini.css`/* styles.css */
body {
  width: 100%;
  height: 100vh;
  margin: 0;
  background-color: #1b1b32; /* Mid-dark cyan background */
  color: #ffffff; /* White text */
  font-family: Tahoma;
  font-size: 16px;
}

.main {
  margin: 1em auto;
  text-align: center;
}

form {
  width: 60vw;
  max-width: 500px;
  min-width: 300px;
  margin: 30vh auto;
  display: grid;
  grid-template-columns: 1fr 1fr ;
  gap: 10px;
  grid-template-rows: auto;
  grid-template-areas: 
    "password password"
    "warning submit"
}

input[type="password"] {
  margin: 10px 0 0 -5px;
  width: 100%;
  min-height: 2em;
  background-color: #2AA1B3; /* Darker background for input */
  border: 1px solid #0a0a23; /* Dark border */
  grid-area: password;
}

button[type="submit"] {
  display: block;
  width: 60%;
  min-width: 300px;
  height: 2em;
  font-size: 1.1rem;
  background-color: #3b3b4f; /* Slightly lighter than background */
  border-color: #3b3b4f; /* Match button color */
  color: #00FFFF; /* Bright cyan text */
  transition: background-color 0.3s ease;
  grid-area: submit;

}

button[type="submit"]:hover {
  background-color: #2d2d3a; /* Slightly darker on hover */
}


/* WebKit, Blink, Edge */
input[type="password"]:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #2AA1B3 inset!important;
}

/* Mozilla Firefox */
input[type="password"]:-moz-autofill {
  box-shadow: 0 0 0 1000px #2AA1B3 inset!important;
}

/* Internet Explorer 10-11 */
input[type="password"]:-ms-input-autofill {
  box-shadow: 0 0 0 1000px #2AA1B3 inset!important;
}

/* Microsoft Edge */
input[type="password"]:-ms-autofill {
  box-shadow: 0 0 0 1000px #2AA1B3 inset!important;
}
input::placeholder {
  color: #1b1b32 ; /* Default color for other modern browsers */
}


`;
