# Molecule

A Molecule is a re-usable component composed of other [atoms](../atoms/README.md), it more complex then an atom and can be a wrapper for child components.

Internal state usage is discouraged, but can be used when needed.

Use the following component format
```js

import {
  Text,
  View
} from 'react-native';

export default ({ text, children }) => (
  <View>
    <Text>{text}</Text>
    {children}
  </View>
);
```
