"use client"

import { Authenticator } from "@aws-amplify/ui-react"

const AuthClient = () => {
  return <Authenticator
  signUpAttributes={["given_name", "family_name"]}
  components={{
    SignUp: {
      FormFields() {
        return (
          <>
            <Authenticator.SignUp.FormFields />
            <div className="amplify-field-group">
              <label htmlFor="given_name">First Name</label>
              <input name="given_name" required />
            </div>
            <div className="amplify-field-group">
              <label htmlFor="family_name">Last Name</label>
              <input name="family_name" required />
            </div>
          </>
        );
      },
    },
  }}
/>
}

export default AuthClient; 