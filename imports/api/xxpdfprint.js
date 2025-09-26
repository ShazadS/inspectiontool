import { Meteor } from 'meteor/meteor';
var base64 = Npm.require('base64-stream');
var Future = Npm.require('fibers/future');
var PDFDocument = Npm.require('pdfkit');
var fs=Npm.require('fs');

function somePDFGeneratingFunction() {
    var doc = new PDFDocument(); // ({...});
    doc.pipe( fs.createWriteStream('/home/gabi/NetBeansProject/vinspection/out.pdf') );

    doc.moveTo(300, 75)
        .lineTo(373, 301)
        .lineTo(181, 161)
        .lineTo(419, 161)
        .lineTo(227, 301)
        .fill('red', 'even-odd');

    var loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in...';

    doc.y = 320;
    doc.fillColor('black');
    doc.text(loremIpsum, {
        paragraphGap: 10,
        indent: 20,
        align: 'justify',
        columns: 2
    });

    // doc.pipe( res);
    // res.download('out.pdf');
    doc.end();
    // var future = new Future();
    // var finalString = "";
    // var stream = doc.pipe(base64.encode()); // encode data in a stream with base64
    // doc.end();
    // stream.on('data', function(chunk){
    //     finalString += chunk;
    // });
    //
    // stream.on('end', Meteor.bindEnvironment(function(){
    //     future.return(finalString);
    // }));

    return 1;//  future.wait();
}

Meteor.methods({
     'xxpdfprint.printchecklist'() {
        console.log("printchecklist");
         return somePDFGeneratingFunction();
    },
});
