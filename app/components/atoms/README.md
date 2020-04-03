# Atom

An atom is the smallest component we have, it is used to make simple re-usable building blocks for the other component types. It is not required to make everything an atom, but a nice thing to have if you always style a button the same way.

Internal state usage is discouraged, but can be used when needed

Use the following component format
```js

import {
  Button
} from 'react-native';

export default ({ style, title }) => (
  <Button title={title} style={{ ..style, color: 'red'}} />
)
```
