Datahub is an early project. It comes to be a data middle layer solution or data-typed micro service framework. In duck to use datahub can get a more easier coding experience in ORM like realms. Developer can ignore something about data persistence for focus on product features when developing. In practice, the cost of development can be reduced so much.

# Usage


Recommanded practice,
```js
const Duck = require('@or-change/duck');

// Can be from other files.
function Account(adapter, injection, context) {
  return {
    schemas: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      }
    },
    methods: {
      query(accountId) {
        return adaptor.getAccountById(accountId);
      },
      ...
    }
  };
}

Duck({
  id: 'com.oc.duck.test',
  components: [
    Duck.Datahub([
      {
        id: 'com.foo.bar.baz',
        models: {
          Account
        }
      }
    ])
  ],
  installed({ Datahub, injection }) {
    // Getting a datahub instance with an adapter object.
    // Put it on injection for using in anywhere.
    injection.Model = Datahub('com.foo.bar.baz', { foo: 'bar' }).model;
  }
}, ({ Model }) => {
  // Using `Model` like this type in somewhere can accessing injection.
  const account = Model.Account.query('1');
  // => { id: 1, name: '...', email: '...' }
});
```
# API Reference

## Options
## Dependence
## Instant
## About adapter