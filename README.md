#Sandhyadeep Beauty Parlour Mobile App

This project is created using Angular and Ionic 7. We are using standalone components and it's purely created in Capacitor.
We have added commands in package.json to quickly run the app on iOS and Android:

```
"add-ios": "ionic capacitor add ios",
"build-ios": "ionic capacitor build ios",
"remove-ios": "rm -rf ios",
"app-sync": "npx cap sync",
"ios-live": "ionic capacitor run ios -l --host=0.0.0.0",
"add-android": "ionic capacitor add android",
"build-android": "ionic capacitor build android",
"android-live": "ionic capacitor run android -l --host=0.0.0.0",
"start": "ionic serve"
```


##Installation
- Clone the repository: 
```git clone https://github.com/Aashishb4u/sandhyadeep-ionic-7.git```

- Navigate to the project directory: ```cd Sandhyadeep-ionic-7```
- Install dependencies: ```npm install```

##Development server
Run npm start or ionic serve for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

##Building the app 

###iOS

- Add iOS platform: ```npm run add-ios```
- Build iOS platform: ```npm run build-ios```
- Open the Xcode project in the ios folder and build the app.

###Android
- Add Android platform: ```npm run add-android```
- Build Android platform: ```npm run build-android```
- Open Android Studio and load the project in the android folder. Build and run the app.

##Running the app

###iOS
- Sync the app with Capacitor: ```npm run app-sync```
- Run the app on a connected iOS device: ```npm run ios-live```
- Sync the app with Capacitor: ```npm run app-sync```
- Run the app on a connected Android device: ```npm run android-live```

##License
All rights reserved to Sandhyadeep Beauty Parlour, India
