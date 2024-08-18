# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

**Note:**  This app works only on mobile devices. To open the app:
- Make sure your mobile device and PC are connected to the same network.
- Scan the QR code that appears in the terminal or Expo DevTools with your mobile device.
- If the QR code is not accessible, download the [Expo Go](https://expo.dev/go) app from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&pli=1) or [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779).
- Open Expo Go and enter the URL shown in the terminal or DevTools manually.

If you still have any problems accessing the app, feel free to email us at:
- [gamesuggester24@gmail.com](mailto:gamesuggester24@gmail.com)
- [gamesuggester24@hotmail.com](mailto:gamesuggester24@hotmail.com)


In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

 3. For backend, please open backend directory.
   1. Configure the `BASE URL`
      - Open the app.json file in the root of the project.
      - Modify the following under the "extra" section:
      ```json
      "extra": {
      "BASE_URL": "http://your-local-ip:3000"
      }
      ```
      - Replace "http://your-local-ip:3000" with your local IP address. You can find your local IP address by running `ipconfig` on Windows or `ifconfig` on macOS/Linux.
   
   2. Start Server
    ```bash
      cd backend
      npm i
      node server.js
    ```
In the output you will see:
Starting server...
Credentials loaded successfully
 - Server is running on http://localhost:3000
 - Starting authorization and download for file ID: fileId
 - Token set successfully
 - File download complete

For now the data is correctly fetched and shown on web but not on app itself. It takes sometime for fetched 3 games to be shown in the home page.
You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
