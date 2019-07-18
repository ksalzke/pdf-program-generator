var doc = new PDFDocument({
  size: "A5",
  margin: 25
});
var stream = doc.pipe(blobStream());

for (let i = 0; i < concertData.performances.length; i++) {
  let performance = concertData.performances[i];
  doc.fontSize(12).text(performance.student);
  doc.moveUp().text(performance.piece, {
    align: "center"
  });
  doc.moveUp().text(performance.composer, {
    align: "right"
  });
  doc.fontSize(8).text("Accomp: " + performance.accompanist);
  doc.moveUp().text(performance.instrument, {
    align: "center"
  });
  doc.moveUp().text("Arr: " + performance.arranger, {
    align: "right"
  });
  doc.moveDown(3);
}

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
