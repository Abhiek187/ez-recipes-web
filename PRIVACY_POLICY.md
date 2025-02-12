# EZ Recipes: Privacy Policy

> [!IMPORTANT]
>
> While this privacy policy lives in the web app, it also applies to the iOS and Android apps.

Welcome to the EZ Recipes app!

This is an open-source project developed by Abhishek Chaudhuri. The source code is available on GitHub.

I take privacy very seriously. I know how concerning it is when apps collect your data without your knowledge.

## Unauthenticated Access

By using one of our apps, your network activity will be logged by the EZ Recipes server. This ensures we have a clear audit for API requests to our server and other 3rd parties: spoonacular, MongoDB, and Firebase. It will also help us troubleshoot any issues between the different services. Sensitive information, like passwords or API keys, is redacted in the logs so we don't collect any PII (personally identifiable information). You cannot opt out of collecting this data unless you host your own server (see [Cloning the App](#cloning-the-app)).

## Authenticated Access

By signing up for an account, you agree to have your email, a unique ID, and recipe preferences stored in Firebase and MongoDB. If your email address isn't verified within a week of account creation, the account will be deleted from our systems as part of a daily cron job. Your password is never stored with us and is only used to validate your credentials against Firebase. An ID token is issued to each client and stored on the device for temporary access. Refresh tokens are managed on the server end and are encrypted in MongoDB. In other words, no server admin can log in as someone else without knowing their credentials.

## Deleting your Account

The best way to delete your account is within the app itself. Click the "Delete Account" button on your profile and enter your username to confirm deletion. This will immediately delete all data in Firebase and MongoDB associated with your unique ID.

> [!NOTE]
>
> Anonymously collected data, such as recipe views, will not be deleted alongside your account.

Users who wish to delete their data after uninstalling the app can send an email to me at achaudhuri2011@yahoo.com. Please use the same email used to create the account to ensure we don't accidentally delete someone else's account.

## Cloning the App

Any fork or clone of these repos is _highly_ encouraged to host their own servers and manage their own API keys and databases. This is so data isn't mixed up between clients we can't validate.

---

Any other data not mentioned above is stored on your device only and can be simply erased by clearing the app's data or uninstalling it.

If you find any security vulnerability that has been inadvertently caused by me or have any questions regarding how the app protects your privacy, please send me an email. I will surely try to fix it/help you.

Yours truly,\
Abhishek Chaudhuri\
achaudhuri2011@yahoo.com
