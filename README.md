## Commissioning Application 
Mobile application that integrates with Project Completion System (ProCoSys) commissioning checklists. 

#### Setup: 
`yarn install`

#### Run:
`npx react-native run-ios`

`npx react-native run-android`

#### DeepLinking:
Testing deeplinking in Android Emulator:

`adb shell am start -W -a android.intent.action.VIEW -d "commapp://v1:commpkg:1002-D01"`
