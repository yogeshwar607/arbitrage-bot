const functions = require('firebase-functions');
const admin = require("firebase-admin");


admin.initializeApp();

// exports.alertCreated = functions.firestore
//     .document('alerts/{alertId}')
//     .onCreate((snap, context) => {
//       return new Promise((resolve,reject)=>{
//         if(snap.data()){
//           const newValue = snap.data();
//           resolve(newValue);
//         }
//         reject(new Error("something bad happened"))
//       })
//     });