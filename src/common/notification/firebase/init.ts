import * as fs from "fs";
import { FirebasePushNotificationProvider } from "./firebase.service";
import path from "path";

const config = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../../config/social-app-e63c3-firebase-adminsdk-fbsvc-63db062e1d.json")
  ) as unknown as string
);

export const firebasePushNotificationProvider = new FirebasePushNotificationProvider(config);
