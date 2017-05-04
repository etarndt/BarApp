var functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//  exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
//  });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.thumbnailProfile = functions.database.ref('/Data/{id}')
        .onWrite(event => {
        var eventSnapshot = event.data;

var lastTime = eventSnapshot.child('lastTimestamp').val();
var firstTime = eventSnapshot.child('firstTimestamp').val();

var longSnapshot = eventSnapshot.child('long');
var shortSnapshot = eventSnapshot.child('short');
var mediumSnapshot = eventSnapshot.child('medium');
var noLineSnapshot = eventSnapshot.child('noline');

if ((lastTime - firstTime) >= 1) {
    if (longSnapshot.changed()) {

        eventSnapshot.ref.child('UUID').remove()
        eventSnapshot.ref.child('UUID').push(1)

            return eventSnapshot.ref.update({
                long: 1, medium: 0, noline: 0, short: 0,
                Line_length: "long", firstTimestamp: lastTime
            });

    }
    if (shortSnapshot.changed()) {

        eventSnapshot.ref.child('UUID').remove()
        eventSnapshot.ref.child('UUID').push(1)

            return eventSnapshot.ref.update({
                long: 0, medium: 0, noline: 0, short: 1,
                Line_length: "short", firstTimestamp: lastTime
            });

    }
    if (mediumSnapshot.changed()) {

        eventSnapshot.ref.child('UUID').remove()
        eventSnapshot.ref.child('UUID').push(1)

            return eventSnapshot.ref.update({
                long: 0, medium: 1, noline: 0, short: 0,
                Line_length: "medium", firstTimestamp: lastTime
            });

    }
    if (noLineSnapshot.changed()) {

        eventSnapshot.ref.child('UUID').remove()
        eventSnapshot.ref.child('UUID').push(1)

            return eventSnapshot.ref.update({
                long: 0, medium: 0, noline: 1, short: 0,
                Line_length: "no line", firstTimestamp: lastTime
            });

    }

}

var done = 0

if ((lastTime - firstTime) < 1) {
    console.log('firstTime: ' + 3)

    var highNum = Math.max(longSnapshot.val(),shortSnapshot.val(),mediumSnapshot.val(),noLineSnapshot.val())

    console.log(highNum)
    if (highNum == longSnapshot.val()){
        done = 1
        return eventSnapshot.ref.update({
            Line_length: "long"});
    }

    if (highNum == mediumSnapshot.val() && done == 0) {
        if (longSnapshot.val() == mediumSnapshot.val()) {
            done = 1
            return eventSnapshot.ref.update({
                Line_length: "long"});
        }
        else {

            return eventSnapshot.ref.update({
                Line_length: "medium"
            });
        }
    }

    if (highNum == shortSnapshot.val() && done == 0) {
        if (mediumSnapshot.val() == shortSnapshot.val()) {
            done = 1

            return eventSnapshot.ref.update({
                Line_length: "medium"});
            if (longSnapshot.val() == shortSnapshot.val()) {
                done = 1
                return eventSnapshot.ref.update({
                    Line_length: "long"});
            }
        }
        else {
            return eventSnapshot.ref.update({
                Line_length: "short"
            });
        }
    }

    if (highNum == noLineSnapshot.val() && done == 0) {
        if (shortSnapshot.val() == noLineSnapshot.val()) {
            return eventSnapshot.ref.update({
                Line_length: "short"});
            if (mediumSnapshot.val() == noLineSnapshot.val()) {

                return eventSnapshot.ref.update({
                    Line_length: "medium"});
                if (longSnapshot.val() == noLineSnapshot.val()) {
                    return eventSnapshot.ref.update({
                        Line_length: "long"});
                }
            }
        }
        else {
            return eventSnapshot.ref.update({
                Line_length: "no line"
            });
        }
    }



}
});