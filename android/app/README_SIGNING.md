## Commands
Sign: 
`jarsigner -keystore app/release.keystore -storepass <password> app/build/outputs/bundle/release/app.aab <key-alias>`

## How its setup

`android/app/build.gradle` has the signing information in it. 
`android-release-key.keystore` is copied over to `android/app/` folder so that it can be used with automatic gradle signing. 


### DO NOT LOOSE OR CHANGE THIS KEY - THIS WILL RESULT IN A COMPLETE RE-RELEASE OF APP IN GOOGLE PLAY - WITH NEW IDENTIFIER AND EVERYTHING! 