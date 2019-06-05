let db;

function getDatabase() {
    if (db) {
        return  db;
    }

    let firebaseConfig = {
        apiKey: "AIzaSyAODI88N3e8O6jUDdpM_417BqUL_7f76h4",
        authDomain: "skill-itch.firebaseapp.com",
        databaseURL: "https://skill-itch.firebaseio.com",
        projectId: "skill-itch",
        storageBucket: "skill-itch.appspot.com",
        messagingSenderId: "72666158740",
        appId: "1:72666158740:web:6760c5d5f0c511d5"
    };

    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    return db;
}

function saveUpdate(courseId, field, value) {
    let db = getDatabase();
    let doc = {
        courseId: courseId,
        field: field,
        value: value
    };

    return db.collection("updates").add(doc);
}

function saveReview(answers) {
    let db = getDatabase();

    let batch = answers.reduce((processed, answer) => {
        let docRef = db.collection('reviews').doc();
        processed.set(docRef, answer);
        return processed;
    }, db.batch());

    return batch.commit();
}