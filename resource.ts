import { Amplify } from 'aws-amplify';

export const amplifyConfig = {
  api: {
    myGraphQLAPI: {
      resourceName: "myGraphQLAPI",
      service: "AppSync",
      apiType: "GraphQL",
      authorizationType: "AMAZON_COGNITO_USER_POOLS",
    },
  },
  auth: {
    myAuth: {
      service: "Cognito",
    },
  }
};

// Apply configuration
Amplify.configure(amplifyConfig);
