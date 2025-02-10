"use client";

import { Amplify } from 'aws-amplify';
import outputs from '@/../amplify_outputs.json'
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs, {ssr: true});

const Auth = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Authenticator.Provider>{children}</Authenticator.Provider>
    </div>
  );
};

export default Auth;
