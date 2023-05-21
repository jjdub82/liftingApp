document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    const db =firebase.firestore();
    console.log(app)
    console.log('some words here')


        const myPost = db.collection('Sessions').doc('First Post');

        myPost.get()
        .then(doc=>{
            const data = doc.data();
            document.write(data.Group + '<br>')
            document.write( data.Date)
        })
    })

function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
            document.write(`{Heeeelllooooo ${user.displayName}`);
            console.log(user)
        })
        .catch(console.log)      
}

function updateSession(e) {
    const db = firebase.firestore();
    const session = db.collection('Sessions').doc('First Post');
    session.update({ group: e.target.value })
}

