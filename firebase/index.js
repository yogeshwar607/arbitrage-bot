const {
    db
} = require('./config');

function demoInitialize(db) {
    // [START demo_initialize]
    // Fetch data from Firestore
    db.collection('exchanges').get()
        .then(documentSet => {
            // Print the ID and contents of each document
            documentSet.forEach(doc => {
                console.log(doc.data());
            });
        })
        .catch(err => {
            // Error fetching documents
            console.log('Error', err);
        });
    // [END demo_initialize]
}


demoInitialize(db);

function addDocument(db) {
    // [START add_document]
    // Add a new document with a generated id.
    var addDoc = db.collection('users').add({
        email: 'example@gmail.com',
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });

    var addDoc = db.collection('alerts').add({
        condition: "lessthan",
        frequency: "onlyonce",
        tpair: "btcusd",
        userid: "1OCCxDT57VMiQQhLPJE4",
        value: Math.random(),
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });

    // [END add_document]
}

addDocument(db)
addDocument(db)


function streamSnapshot(db, done) {
    // [START query_realtime]
    var query = db.collection('alerts');
  
    var observer = query.onSnapshot(querySnapshot => {
      
        console.log(`Received query snapshot of size ${querySnapshot}`);
      // [START_EXCLUDE]
      observer();
      done();
      // [END_EXCLUDE]
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
    // [END query_realtime]
  }
  streamSnapshot(db,x=>{});

  function streamDocument(db, done) {
    // [START doc_realtime]
    // var doc = db.collection('alerts');
    // var observer = doc.onSnapshot(docSnapshot => {
    //   console.log(`Received doc snapshot: ${docSnapshot}`);
    //   // [START_EXCLUDE]
    //   observer();
    //   done();
    //   // [END_EXCLUDE]
    // }, err => {
    //   console.log(`Encountered error: ${err}`);
    // });
    // [END doc_realtime]

    let query = db.collection('alerts');

    let unsubscribe = query.onSnapshot(querySnapshot => {
      for (let change of querySnapshot.docChanges) {
        console.log(change.doc.data(),"change in data");
      }
    });
  }
  streamDocument(db,x=>{});

//   function detatchListener(db) {
//     // [START detach_listener]
//     var unsub = db.collection('cities').onSnapshot(() => {});
  
//     // ...
  
//     // Stop listening for changes
//     unsub();
//     // [END detach_listener]
//   }
  



