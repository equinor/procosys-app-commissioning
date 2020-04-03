# Organisms

An organism is a complex re-usable component, it can have its own internal state or be connected to an external store/reducer. This can also be used as a wrapper to connect molecules to redux with connect(). Organisms should only be made if you are ___really___ in need of them. If unsure start with a [molecule](../molecules/README.md) and wrap it in a organisms if there should be a need

Use the following component format
```js

import React, { Component } from 'react'
import {
  Text
} from 'react-native';

export default class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<Text>my cool text</Text>)
  }
}

```
