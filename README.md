# abckey-webusb-pro

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Dev-Caution
### The display of Dialog
For the convenience of development, some dialog boxes do not control the display or not through this store. 
- Not controlled by this store: 
  - ConnectDevice.vue
  - Failure.vue
  - ButtonAck.vue
- Specially
  - Language.vue
    - Displayed if app.language's store is FALSE or dialog.language is TRUE.