import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import './styles/App.css';
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import 'bootstrap/dist/css/bootstrap.css';
import { SubscriptionClient } from "subscriptions-transport-ws";

const port = process.env.PORT || 4000
const httpLink = createHttpLink({
  uri: `http://localhost:${port}`,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// const GRAPHQL_ENDPOINT = `ws://localhost:${port}`;
const GRAPHQL_ENDPOINT = `wss://thawing-waters-21862.herokuapp.com`;

const wsClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem(AUTH_TOKEN),
  },
});

const wsLink = new WebSocketLink(wsClient);

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:${port}`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       authToken: localStorage.getItem(AUTH_TOKEN),
//     },
//   },
// })

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
serviceWorker.unregister()
