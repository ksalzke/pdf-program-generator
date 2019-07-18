var doc = new PDFDocument({
  size: "A5",
  margin: 25
});
var stream = doc.pipe(blobStream());

doc.text(concertData.performances[0].student);
doc.moveUp().text(concertData.performances[0].piece, {
  align: "center"
});
doc.moveUp().text(concertData.performances[0].composer, {
  align: "right"
});
doc.fontSize(8).text("Accomp: " + concertData.performances[0].accompanist);
doc.moveUp().text(concertData.performances[0].instrument, {
  align: "center"
});
doc.moveUp().text("Arr: " + concertData.performances[0].arranger, {
  align: "right"
});

// end and display the document in the iframe to the right
doc.end();

var saveData = (function() {
  var a = document.createElement("a");
  console.log(document);
  $("body").append(a);
  a.style = "display: none";
  return function(blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    // a.click();
    $("iframe").prop("src", url);
    window.URL.revokeObjectURL(url);
  };
})();

stream.on("finish", function() {
  var blob = stream.toBlob("application/pdf");
  saveData(blob, "aa.pdf");
});
