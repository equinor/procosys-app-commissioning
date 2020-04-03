# Pages
A page is a scene in the app world. A page can have side effect and be connected
to an external store/reducer. It can also have an internal state.

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
